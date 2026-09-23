$text = Get-Content 'C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1\.system_generated\steps\2532\content.md' -Raw
$idx = $text.IndexOf('id="transformation"')
if ($idx -ge 0) {
    Write-Host $text.Substring($idx, [Math]::Min(2500, $text.Length - $idx))
} else {
    Write-Host "id=transformation not found, searching transformation:"
    $idx2 = $text.IndexOf('transformation')
    Write-Host "idx2: $idx2"
}
