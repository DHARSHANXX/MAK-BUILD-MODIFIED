$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"
$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"

# Test 1: Desktop BA section
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_new_ba_desktop.png",
    '--window-size=1280,950',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$projectDir/index.html#transformation"
) -Wait

# Test 2: Mobile 390 BA section
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_new_ba_mobile_390.png",
    '--window-size=390,950',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$projectDir/index.html#transformation"
) -Wait

# Test 3: Hero section Desktop
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_new_hero_desktop.png",
    '--window-size=1280,800',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$projectDir/index.html"
) -Wait

# Test 4: Hero section Mobile 390
Start-Process -FilePath $edge -ArgumentList @(
    '--headless=new',
    "--screenshot=$artifactsDir\verified_new_hero_mobile_390.png",
    '--window-size=390,844',
    '--hide-scrollbars',
    '--disable-gpu',
    "file:///$projectDir/index.html"
) -Wait

Write-Output "Captures complete."
