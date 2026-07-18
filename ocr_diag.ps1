[System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")
$extType = [System.WindowsRuntimeSystemExtensions]
$extType.GetMethods() | Where-Object { $_.Name -eq "AsTask" } | ForEach-Object {
    Write-Host "Method: $_"
    $_.GetParameters() | ForEach-Object {
        Write-Host "  Param: $_ ($($_.ParameterType.FullName))"
    }
}
