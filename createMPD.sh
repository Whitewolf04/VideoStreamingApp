#!/bin/bash

input_dir="/Users/whitewolf04/Documents/VideoStreamingApp/"
output_file="/Users/whitewolf04/Documents/VideoStreamingApp/output.mpd"

# Find all the MP4 segment files in the input directory
segment_files=$(find "$input_dir" -name "output_video*.mp4" -type f | sort)

# Write the list of input files to a temporary file
file_list=""
for file in $segment_files; do
	file_list="$file_list file '$file'\n"
done

# Use FFmpeg to compile the segments into an MPD file
ffmpeg_command="ffmpeg -f concat -safe 0 -i <(echo -e \"$file_list\") \
-map 0 -map 0 -c:a aac -c:v libx264 \
-b:v:0 4000k -b:v:1 2000k -b:v:2 1000k -b:v:3 700k \
-s:v:0 1280x720 -s:v:1 854x480 -s:v:2 640x360 -s:v:3 426x240 \
-profile:v:0 main -profile:v:1 main -profile:v:2 baseline -profile:v:3 baseline \
-bf 1 -keyint_min 120 -g 120 -sc_threshold 0 -b_strategy 0 \
-ar:a:0 48000 -ar:a:1 48000 -ar:a:2 48000 -ar:a:3 24000 \
-use_timeline 1 -use_template 1 -window_size 3 -adaptation_sets \"id=0,streams=v id=1,streams=a\" \
-hls_playlist_type vod -f dash \"$output_file\""
echo "Executing FFmpeg command: $ffmpeg_command"
eval "$ffmpeg_command"
