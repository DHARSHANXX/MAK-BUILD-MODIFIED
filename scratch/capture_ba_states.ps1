$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$artifactsDir = "C:\Users\DHARSHAN\.gemini\antigravity\brain\4a32252f-1f0e-4131-8d2d-440c322de3e1"
$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"

$origHtml = "$projectDir\index.html"
$content = [System.IO.File]::ReadAllText($origHtml, [System.Text.Encoding]::UTF8)

# Positions to capture: 100 (Before), 50 (Split), 0 (After)
$states = @(
    @{ Pos = 100; Name = "qa_ba_100_before" },
    @{ Pos = 50;  Name = "qa_ba_50_split" },
    @{ Pos = 0;   Name = "qa_ba_0_after" }
)

foreach ($s in $states) {
    $pos = $s.Pos
    $name = $s.Name
    $tempFile = "$projectDir\temp_ba_${pos}.html"
    
    # Inject script that scrolls to #transformation and sets ba position
    $inject = @"
<script>
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const sec = document.getElementById('transformation');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        if (typeof setBaPosition === 'function') {
            setBaPosition($pos);
        }
    }, 400);
});
</script>
"@
    $mod = $content.Replace("</body>", "$inject</body>")
    [System.IO.File]::WriteAllText($tempFile, $mod, [System.Text.Encoding]::UTF8)

    Start-Process -FilePath $edge -ArgumentList @(
        '--headless=new',
        '--window-size=390,844',
        "--screenshot=$artifactsDir\${name}_390.png",
        '--default-background-color=00000000',
        '--disable-gpu',
        "file:///$tempFile"
    ) -Wait

    Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
}

Write-Output "BA state screenshots captured."
