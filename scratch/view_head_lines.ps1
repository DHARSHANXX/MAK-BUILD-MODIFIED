$lines = Get-Content -Path .\index.html
for ($i = 50; $i -le 57; $i++) {
    $line = $lines[$i]
    $preview = $line.Substring(0, [Math]::Min(100, $line.Length))
    Write-Output "$($i+1): $preview"
}
