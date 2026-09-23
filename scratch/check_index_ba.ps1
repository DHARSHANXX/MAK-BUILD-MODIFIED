$txt = (Get-Content "assets\ba-after-base64.txt").Trim()
$indexContent = [System.IO.File]::ReadAllText("index.html")
$inIndex = $indexContent.Contains($txt)
Write-Output "ba-after-base64 present in index.html: $inIndex"
