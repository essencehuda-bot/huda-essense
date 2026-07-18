try {
    # Load Windows Runtime types explicitly to avoid resolution issues in loop/functions
    [Void][System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")
    
    $types = @(
        "Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType=WindowsRuntime",
        "Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType=WindowsRuntime",
        "Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType=WindowsRuntime",
        "Windows.Media.Ocr.OcrResult, Windows.Media.Ocr, ContentType=WindowsRuntime"
    )
    
    foreach ($t in $types) {
        $loadedType = [Type]::GetType($t)
        if (-not $loadedType) {
            Write-Error "Could not load type: $t"
            exit
        }
    }
    
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
    if (-not $engine) {
        Write-Error "Could not create OcrEngine."
        exit
    }
    
    Write-Host "OCR Engine loaded. Language: $($engine.Language.LanguageTag)"
    
    $extType = [System.WindowsRuntimeSystemExtensions]
    $asTaskMethods = $extType.GetMethods() | Where-Object { $_.Name -eq "AsTask" }
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
    
    # Get all GPT-generated images
    $imagesDir = "public\images"
    $files = Get-ChildItem -Path $imagesDir -Filter "gpt-image-*" | Sort-Object Name
    
    $results = @()
    $count = 0
    $total = $files.Count
    
    Write-Host "Starting OCR scan of $total images..."
    
    foreach ($file in $files) {
        $count++
        $filePath = $file.FullName
        $fileName = $file.Name
        
        try {
            $text = Get-OcrText($filePath)
            $cleanText = $text -replace "`r`n", " " -replace "`n", " " -replace "\s+", " "
            
            $item = [PSCustomObject]@{
                filename = $fileName
                raw_text = $cleanText
            }
            $results += $item
            
            Write-Host "[$count/$total] $fileName : $cleanText"
        } catch {
            Write-Host "[$count/$total] ERROR scanning $fileName : $_" -ForegroundColor Red
        }
        
        # Save intermediate results
        if ($count % 10 -eq 0 -or $count -eq $total) {
            $results | ConvertTo-Json -Depth 5 | Set-Content "ocr_mappings_temp.json"
        }
    }
    
    # Save final results
    $results | ConvertTo-Json -Depth 5 | Set-Content "ocr_mappings.json"
    Write-Host "Scan completed! Results saved to ocr_mappings.json"
    
} catch {
    Write-Error $_.Exception.ToString()
}
