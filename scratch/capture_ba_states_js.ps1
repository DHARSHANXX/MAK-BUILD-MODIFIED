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

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"

# 1. 100% After state (pos = 0)
$script0 = "<script>window.addEventListener('DOMContentLoaded', () => { setTimeout(() => { if (window.setBaPosition) window.setBaPosition(0); }, 300); });</script>"
$mod0 = $cleanHtml.Replace("</body>", "$script0</body>")
$temp0 = "$projectDir\temp_ba_0.html"
[System.IO.File]::WriteAllText($temp0, $mod0, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_ba_100_after_390.png",
    '--window-size=390,920',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$temp0"
) -Wait
Remove-Item $temp0 -Force -ErrorAction SilentlyContinue

# 2. 100% Before state (pos = 100)
$script100 = "<script>window.addEventListener('DOMContentLoaded', () => { setTimeout(() => { if (window.setBaPosition) window.setBaPosition(100); }, 300); });</script>"
$mod100 = $cleanHtml.Replace("</body>", "$script100</body>")
$temp100 = "$projectDir\temp_ba_100.html"
[System.IO.File]::WriteAllText($temp100, $mod100, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_ba_100_before_390.png",
    '--window-size=390,920',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$temp100"
) -Wait
Remove-Item $temp100 -Force -ErrorAction SilentlyContinue

Write-Output "JS-driven 100% states captured."
