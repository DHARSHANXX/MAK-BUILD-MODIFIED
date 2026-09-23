$res = Invoke-WebRequest -Uri 'https://dharshanxx.github.io/MAK-BUILD-MODIFIED/index.html' -UseBasicParsing
$html = $res.Content
$idxBefore = $html.IndexOf('window.MAK_BA_BEFORE = "') + 'window.MAK_BA_BEFORE = "'.Length
$endBefore = $html.IndexOf('";', $idxBefore)
$b64Before = $html.Substring($idxBefore, $endBefore - $idxBefore).Replace('data:image/jpeg;base64,', '').Trim()
$bytesBefore = [Convert]::FromBase64String($b64Before)
[IO.File]::WriteAllBytes('C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\live-before.jpg', $bytesBefore)

$idxAfter = $html.IndexOf('window.MAK_BA_AFTER = "') + 'window.MAK_BA_AFTER = "'.Length
$endAfter = $html.IndexOf('";', $idxAfter)
$b64After = $html.Substring($idxAfter, $endAfter - $idxAfter).Replace('data:image/jpeg;base64,', '').Trim()
$bytesAfter = [Convert]::FromBase64String($b64After)
[IO.File]::WriteAllBytes('C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\live-after.jpg', $bytesAfter)
Write-Host "Saved live-before.jpg and live-after.jpg successfully!"
