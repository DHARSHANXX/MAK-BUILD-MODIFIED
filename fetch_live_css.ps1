$res = Invoke-WebRequest -Uri 'https://dharshanxx.github.io/MAK-BUILD-MODIFIED/styles.css' -UseBasicParsing
$css = $res.Content
$idx = $css.IndexOf('.ba-overlay-clipped')
Write-Host "ba-overlay-clipped idx: $idx"
if ($idx -ge 0) {
    Write-Host $css.Substring($idx, [Math]::Min(1500, $css.Length - $idx))
}
