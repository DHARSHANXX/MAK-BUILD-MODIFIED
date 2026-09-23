$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"
$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"

# 1. Desktop 1440x900 full page
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    '--window-size=1440,900',
    "--screenshot=$artifactsDir\qa_desktop_1440.png",
    '--default-background-color=00000000',
    '--disable-gpu',
    "file:///$projectDir/index.html"
) -Wait

# 2. Mobile 390x844 (iPhone 14/15)
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    '--window-size=390,844',
    "--screenshot=$artifactsDir\qa_mobile_390.png",
    '--default-background-color=00000000',
    '--disable-gpu',
    "file:///$projectDir/index.html"
) -Wait

# 3. Mobile 360x800 (Android common)
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    '--window-size=360,800',
    "--screenshot=$artifactsDir\qa_mobile_360.png",
    '--default-background-color=00000000',
    '--disable-gpu',
    "file:///$projectDir/index.html"
) -Wait

Write-Output "Screenshots captured successfully."
