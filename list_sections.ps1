$text = Get-Content 'C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\index.html' -Raw
$matches = [regex]::Matches($text, '<section\s+[^>]*id="([^"]+)"[^>]*>')
foreach ($m in $matches) {
    Write-Host $m.Value
}
