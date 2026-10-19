param(
    [string]$OutputFile = "output.wav",
    [string]$Text = "Welcome to JammuKhoj.",
    [int]$Rate = 1
)

Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Select high quality natural voice
try {
    $synth.SelectVoice("Microsoft Zira Desktop")
} catch {
    # fallback to default installed voice if Zira not present
}

$synth.Rate = $Rate
$synth.SetOutputToWaveFile($OutputFile)
$synth.Speak($Text)
$synth.Dispose()
Write-Host "SUCCESS: Generated voiceover at $OutputFile"
