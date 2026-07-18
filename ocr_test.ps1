try {
    # Load Windows Runtime types
    [Void][System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")
    
    $typeName = "Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType=WindowsRuntime"
    $OcrEngineType = [Type]::GetType($typeName)
    
    if (-not $OcrEngineType) {
        Write-Error "Could not load Windows.Media.Ocr.OcrEngine type."
        exit
    }
    
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
    if (-not $engine) {
        Write-Error "Could not create OcrEngine."
        exit
    }
    
    Write-Host "OCR Engine loaded. Language: $($engine.Language.LanguageTag)"
    
    $extType = [System.WindowsRuntimeSystemExtensions]
    $asTaskMethods = $extType.GetMethods() | Where-Object { $_.Name -eq "AsTask" }
    
    # Correct filter for IAsyncOperation using single quotes for generic backtick
    $asTaskOpMethod = $asTaskMethods | Where-Object { 
        $params = $_.GetParameters()
        $_.IsGenericMethod -and $params.Length -eq 1 -and $params[0].ParameterType.Name.StartsWith('IAsyncOperation`1')
    } | Select-Object -First 1
    
    if (-not $asTaskOpMethod) {
        Write-Error "Could not find AsTask(IAsyncOperation) method."
        exit
    }
    
    function Get-OcrText($filePath) {
        $absPath = [System.IO.Path]::GetFullPath($filePath)
        if (-not (Test-Path $absPath)) { return $null }
        
        $fileStream = [System.IO.File]::OpenRead($absPath)
        [Void][System.Reflection.Assembly]::LoadWithPartialName("System.IO.WindowsRuntime")
        $winrtStream = [System.IO.WindowsRuntimeStreamExtensions]::AsRandomAccessStream($fileStream)
        
        # 1. Create decoder
        $decoderOp = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($winrtStream)
        $decoderGeneric = $asTaskOpMethod.MakeGenericMethod([Windows.Graphics.Imaging.BitmapDecoder])
        $decoderTask = $decoderGeneric.Invoke($null, @($decoderOp))
        while (-not $decoderTask.IsCompleted) { Start-Sleep -Milliseconds 5 }
        $decoder = $decoderTask.Result
        
        # 2. Get software bitmap
        $bitmapOp = $decoder.GetSoftwareBitmapAsync()
        $bitmapGeneric = $asTaskOpMethod.MakeGenericMethod([Windows.Graphics.Imaging.SoftwareBitmap])
        $bitmapTask = $bitmapGeneric.Invoke($null, @($bitmapOp))
        while (-not $bitmapTask.IsCompleted) { Start-Sleep -Milliseconds 5 }
        $bitmap = $bitmapTask.Result
        
        # 3. Recognize text
        $resultOp = $engine.RecognizeAsync($bitmap)
        $resultGeneric = $asTaskOpMethod.MakeGenericMethod([Windows.Media.Ocr.OcrResult])
        $resultTask = $resultGeneric.Invoke($null, @($resultOp))
        while (-not $resultTask.IsCompleted) { Start-Sleep -Milliseconds 5 }
        $result = $resultTask.Result
        
        $fileStream.Close()
        return $result.Text
    }
    
    # Let's test on one file first to see if it works!
    $testFile = "public\images\gpt-image-1_a_Create_the_exact_sam_(3).png_202607160741.jpeg"
    if (Test-Path $testFile) {
        $res = Get-OcrText($testFile)
        Write-Host "Test OCR Result for $testFile`:"
        Write-Host "--------------------------------"
        Write-Host $res
        Write-Host "--------------------------------"
    } else {
        Write-Host "Test file not found."
    }
    
} catch {
    Write-Error $_.Exception.ToString()
}
