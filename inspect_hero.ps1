$text = Get-Content 'C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\index.html' -Raw
$bodyIdx = $text.IndexOf('<body')
$hiringIdx = $text.IndexOf('id="hiring"')
$sub = $text.Substring($bodyIdx, $hiringIdx - $bodyIdx)
$matches = [regex]::Matches($sub, '<(div|section|header|nav)[^>]*(id="[^"]+"|\bclass="[^"]*hero[^"]*"|\bclass="[^"]*welcome[^"]*"|class="[^"]*nav[^"]*")[^>]*>')
foreach ($m in $matches) {
    Write-Host $m.Value.Substring(0, [Math]::Min(120, $m.Value.Length))
}
