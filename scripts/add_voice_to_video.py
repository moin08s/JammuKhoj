"""
JammuKhoj - Studio-Grade 1080p Video Generator with Synchronized Voiceover
Generates narration audio segments using Microsoft Speech Synthesis,
renders animated 1080p 60fps frames, and multiplexes them with FFmpeg into
a high-definition product demonstration video.
"""

import os
import subprocess
import wave
import numpy as np

# Script directory
CWD = os.path.abspath(os.getcwd())
FFMPEG_BIN = r"C:\Users\Moin\AppData\Local\Microsoft\WinGet\Links\ffmpeg.exe"
TTS_SCRIPT = os.path.join(CWD, "scripts", "tts_helper.ps1")
AUDIO_DIR = os.path.join(CWD, "public", "demo_video", "audio_tracks")
os.makedirs(AUDIO_DIR, exist_ok=True)

# 7 Scene Narration Scripts
SCENES_NARRATION = [
    {
        "id": "scene_1",
        "title": "Introduction & Hero Cover",
        "text": "Welcome to JammuKhoj. Your Jammu journey, made simple. Designed for pilgrims and transit layovers across the Jammu Division, delivering zero-tracking privacy and complete offline reliability.",
        "target_sec": 8.0,
    },
    {
        "id": "scene_2",
        "title": "Transit Panic & 1-Tap Buffer Engine",
        "text": "No more transit anxiety. The one-tap buffer planner automatically reserves a forty-five minute train buffer and two-and-a-half-hour airport buffer, ensuring you never miss a connection.",
        "target_sec": 9.0,
    },
    {
        "id": "scene_3",
        "title": "Itinerary Execution & Transit Intel",
        "text": "Follow your curated step-by-step circuit. Access verified Matador mini-bus stages from ten to twenty-five rupees, plus official prepaid auto and taxi fare matrices to eliminate tout overcharging.",
        "target_sec": 9.0,
    },
    {
        "id": "scene_4",
        "title": "36+ Destinations & Senior Accessibility",
        "text": "Explore over thirty-six verified heritage landmarks including Bahu Fort and Mubarak Mandi. Every attraction features stair counts, elder-friendly walking load tags, and daily temple aarti timings.",
        "target_sec": 9.0,
    },
    {
        "id": "scene_5",
        "title": "Dogri Food Trail & GI Certified Crafts",
        "text": "Savor authentic Dogri delicacies like Kaladi Kulcha with pure vegetarian and Jain filters. Discover verified cooperatives for Basohli paintings, Pashmina weaves, and Bhaderwah Rajmash.",
        "target_sec": 9.0,
    },
    {
        "id": "scene_6",
        "title": "100% Offline Autonomy & 112 SOS",
        "text": "Engineered for mountain valley blackouts. Entire vector maps, hotlines, and routing reside in local IndexedDB, paired with a one-tap WhatsApp GPS SOS dispatcher and National ERSS one-one-two.",
        "target_sec": 8.0,
    },
    {
        "id": "scene_7",
        "title": "Measurable Outcomes & Call to Action",
        "text": "Extending visitor dwell from two to eight hours, unlocking over one hundred and fifty crores for local families. Experience JammuKhoj live today at jammukhoj.in or on Netlify.",
        "target_sec": 8.0,
    },
]


def synthesize_all_voiceovers():
    print(">>> [1/3] Synthesizing professional narration audio clips...")
    audio_files = []

    for idx, sc in enumerate(SCENES_NARRATION):
        out_wav = os.path.join(AUDIO_DIR, f"{sc['id']}.wav")
        print(f"Generating voice for {sc['title']}...")
        
        # Call PowerShell TTS script
        cmd = [
            "powershell",
            "-ExecutionPolicy", "Bypass",
            "-File", TTS_SCRIPT,
            "-OutputFile", out_wav,
            "-Text", sc["text"],
            "-Rate", "1"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error generating {sc['id']}: {res.stderr}")
        
        # Inspect duration
        if os.path.exists(out_wav):
            with wave.open(out_wav, "rb") as w:
                dur = w.getnframes() / float(w.getframerate())
                print(f"  -> Generated {sc['id']}.wav: {dur:.2f} seconds")
                audio_files.append((out_wav, dur, sc["target_sec"]))
        else:
            print(f"ERROR: Missing {out_wav}")

    return audio_files


def combine_audio_tracks(audio_files, combined_wav_path):
    print(">>> [2/3] Aligning and merging narration tracks to exact scene timings...")
    
    # Standard format: 22050 Hz, 16-bit Mono
    sample_rate = 22050
    total_samples = 0
    merged_data = []

    for wav_path, actual_dur, target_dur in audio_files:
        with wave.open(wav_path, "rb") as w:
            n_frames = w.getnframes()
            frames_raw = w.readframes(n_frames)
            sr = w.getframerate()
            samples = np.frombuffer(frames_raw, dtype=np.int16)

            # Target samples for this scene
            target_samples = int(target_dur * sample_rate)
            
            # If actual audio is shorter than target, pad with silence
            if len(samples) < target_samples:
                pad_len = target_samples - len(samples)
                padded = np.pad(samples, (0, pad_len), mode="constant")
            else:
                # Trim slight excess if any
                padded = samples[:target_samples]

            merged_data.append(padded)
            total_samples += len(padded)

    final_audio = np.concatenate(merged_data)
    
    with wave.open(combined_wav_path, "wb") as out_w:
        out_w.setnchannels(1)
        out_w.setsampwidth(2)
        out_w.setframerate(sample_rate)
        out_w.writeframes(final_audio.tobytes())

    total_duration = total_samples / float(sample_rate)
    print(f"SUCCESS: Combined master voiceover at: {combined_wav_path}")
    print(f"Master Audio Duration: {total_duration:.2f} seconds")
    return total_duration


def multiplex_video_with_audio(video_in, audio_in, video_out):
    print(">>> [3/3] Multiplexing video and narration with FFmpeg...")
    if not os.path.exists(FFMPEG_BIN):
        print(f"ERROR: FFmpeg binary not found at {FFMPEG_BIN}")
        return False

    cmd = [
        FFMPEG_BIN,
        "-y",
        "-i", video_in,
        "-i", audio_in,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "22",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        video_out
    ]

    print(f"Executing: {' '.join(cmd)}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"SUCCESS: Created final narrated video at {video_out}")
        size_mb = os.path.getsize(video_out) / (1024 * 1024)
        print(f"Final Narrated Video Size: {size_mb:.2f} MB")
        return True
    else:
        print("FFmpeg error:")
        print(res.stderr)
        return False


def main():
    audio_files = synthesize_all_voiceovers()
    master_audio = os.path.join(AUDIO_DIR, "master_narration_track.wav")
    combine_audio_tracks(audio_files, master_audio)

    raw_video = os.path.join(CWD, "public", "demo_video", "jammukhoj_demo_walkthrough.mp4")
    final_video = os.path.join(CWD, "public", "demo_video", "jammukhoj_demo_walkthrough_narrated.mp4")

    if os.path.exists(raw_video):
        success = multiplex_video_with_audio(raw_video, master_audio, final_video)
        if success:
            # Also replace the standard walkthrough video with the narrated version for web player
            dest_standard = os.path.join(CWD, "public", "demo_video", "jammukhoj_demo_walkthrough.mp4")
            try:
                import shutil
                shutil.copyfile(final_video, dest_standard)
                print(f"SUCCESS: Updated main web video asset at {dest_standard}")
            except Exception as e:
                print(f"Note copying: {e}")
    else:
        print(f"ERROR: Raw video missing at {raw_video}")


if __name__ == "__main__":
    main()
