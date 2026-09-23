$c1 = Get-Content 'C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\assets\ba-before-base64.txt' -Raw
$c1Clean = $c1.Replace("data:image/jpeg;base64,", "").Trim()
$bytes1 = [Convert]::FromBase64String($c1Clean)
[IO.File]::WriteAllBytes('C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\test-before.jpg', $bytes1)

$c2 = Get-Content 'C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\assets\ba-after-base64.txt' -Raw
$c2Clean = $c2.Replace("data:image/jpeg;base64,", "").Trim()
$bytes2 = [Convert]::FromBase64String($c2Clean)
[IO.File]::WriteAllBytes('C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build\test-after.jpg', $bytes2)
Write-Host "Both decoded successfully"
