$c1 = Get-Content 'C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\assets\ba-before-base64.txt' -Raw
$bytes1 = [Convert]::FromBase64String($c1.Trim())
[IO.File]::WriteAllBytes('C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\test-before-b64.jpg', $bytes1)

$c2 = Get-Content 'C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\assets\ba-after-base64.txt' -Raw
$bytes2 = [Convert]::FromBase64String($c2.Trim())
[IO.File]::WriteAllBytes('C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\test-after-b64.jpg', $bytes2)
Write-Host "Decoded successfully"
