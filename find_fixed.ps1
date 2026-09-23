$text = Get-Content 'C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\index.html' -Raw
$matches = [regex]::Matches($text, '<[^>]*\bfixed\b[^>]*>')
foreach ($m in $matches) {
    Write-Host $m.Value.Substring(0, [Math]::Min(120, $m.Value.Length))
}
