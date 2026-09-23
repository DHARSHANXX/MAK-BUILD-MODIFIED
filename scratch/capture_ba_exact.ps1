$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"
$origHtml = "$projectDir\index.html"
$content = [System.IO.File]::ReadAllText($origHtml, [System.Text.Encoding]::UTF8)

# Cut out everything between <body ...> and <section id="transformation"
$bodyStart = $content.IndexOf('<body')
$bodyTagEnd = $content.IndexOf('>', $bodyStart) + 1
$transStart = $content.IndexOf('<section id="transformation"')

$headPart = $content.Substring(0, $bodyTagEnd)
$transPart = $content.Substring($transStart)

$cleanHtml = $headPart + "`n" + $transPart

$tempFile = "$projectDir\temp_ba_only.html"
[System.IO.File]::WriteAllText($tempFile, $cleanHtml, [System.Text.Encoding]::UTF8)

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"

# 1. Desktop 1280x950
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_new_ba_desktop.png",
    '--window-size=1280,950',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempFile"
) -Wait

# 2. Mobile 390x920
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_new_ba_mobile_390.png",
    '--window-size=390,920',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$tempFile"
) -Wait

Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
Write-Output "Exact BA captures complete."
