input_dir="/mnt/d/VideoStreamingApp"
output_file="/mnt/d/VideoStreamingApp/output.mpd"

# Find all the MP4 segment files in the input directory
segment_files=$(find "$input_dir" -name "output_video*.mp4" -type f | sort)

# Write the list of input files to a temporary file
file_list=""
for file in $segment_files; do
	file_list="$file_list file '$file'\n"
done

# Use FFmpeg to compile the segments into an MPD file
ffmpeg_command="ffmpeg -f concat -safe 0 -i <(echo -e \"$file_list\") -c copy -f dash \"$output_file\""
echo "Executing FFmpeg command: $ffmpeg_command"
eval "$ffmpeg_command"
