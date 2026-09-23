$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }

$projectDir = "C:\Users\DHARSHAN\.gemini\antigravity\scratch\mak-build"
$origHtml = "$projectDir\index.html"
$content = [System.IO.File]::ReadAllText($origHtml, [System.Text.Encoding]::UTF8)

$widths = @(320, 360, 375, 390, 412, 430, 768, 820, 1024, 1280, 1440, 1920)
$results = @()

foreach ($w in $widths) {
    $tempFile = "$projectDir\temp_audit_${w}.html"
    $script = @"
<script>
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const sw = document.documentElement.scrollWidth;
        const cw = document.documentElement.clientWidth;
        const diff = sw - cw;
        console.log('AUDIT_RESULT: w=' + $w + ', sw=' + sw + ', cw=' + cw + ', diff=' + diff);
    }, 600);
});
</script>
"@
    $mod = $content.Replace("</body>", "$script</body>")
    [System.IO.File]::WriteAllText($tempFile, $mod, [System.Text.Encoding]::UTF8)

    $wrapperFile = "$projectDir\wrap_audit_${w}.html"
    $wrapperHtml = @"
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<iframe src="temp_audit_${w}.html" style="width:${w}px; height:800px; border:none;"></iframe>
</body>
</html>
"@
    [System.IO.File]::WriteAllText($wrapperFile, $wrapperHtml, [System.Text.Encoding]::UTF8)

    $tempLog = "$projectDir\audit_${w}.log"
    Start-Process -FilePath $edge -ArgumentList @(
        '--headless=new',
        '--window-size=1000,1000',
        '--enable-logging=stderr',
        '--v=1',
        '--disable-gpu',
        "file:///$wrapperFile"
    ) -RedirectStandardError $tempLog -Wait

    if (Test-Path $tempLog) {
        $m = Get-Content $tempLog | Select-String 'AUDIT_RESULT: w=(\d+), sw=(\d+), cw=(\d+), diff=(\d+)'
        if ($m -and $m.Matches) {
            $diff = [int]$m.Matches[0].Groups[4].Value
            $results += "Viewport ${w}px: Diff=${diff}px (Passed: $($diff -le 0))"
        }
        Remove-Item $tempLog -Force -ErrorAction SilentlyContinue
    }

    Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    Remove-Item $wrapperFile -Force -ErrorAction SilentlyContinue
}

$results | Out-File "$projectDir\audit_summary.txt" -Encoding UTF8
$results
