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

# 1. 100% Before state
$mod100 = $cleanHtml -replace '--ba-pos:\s*50%', '--ba-pos: 100%'
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

# 2. 100% After state
$mod0 = $cleanHtml -replace '--ba-pos:\s*50%', '--ba-pos: 0%'
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

Write-Output "BA 100 Before and 100 After captures complete."
