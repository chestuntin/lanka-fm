"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Filter, Play, Clock, User, Calendar } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

// Sample YouTube music data - replace with your actual data
const sampleMusicData = [
  {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up",
    artist: "Rick Astley",
    duration: "3:33",
    genre: "Pop",
    year: 1987,
    views: "1.4B",
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
  },
  {
    id: "9bZkp7q19f0",
    title: "PSY - GANGNAM STYLE",
    artist: "PSY",
    duration: "4:13",
    genre: "K-Pop",
    year: 2012,
    views: "4.8B",
    thumbnail: `https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg`,
  },
  {
    id: "L_jWHffIx5E",
    title: "Smash Mouth - All Star",
    artist: "Smash Mouth",
    duration: "3:21",
    genre: "Rock",
    year: 1999,
    views: "500M",
    thumbnail: `https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg`,
  },
  {
    id: "hT_nvWreIhg",
    title: "The Weeknd - Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    genre: "R&B",
    year: 2019,
    views: "3.2B",
    thumbnail: `https://img.youtube.com/vi/hT_nvWreIhg/maxresdefault.jpg`,
  },
  {
    id: "fJ9rUzIMcZQ",
    title: "Queen - Bohemian Rhapsody",
    artist: "Queen",
    duration: "5:55",
    genre: "Rock",
    year: 1975,
    views: "1.8B",
    thumbnail: `https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg`,
  },
  {
    id: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You",
    artist: "Ed Sheeran",
    duration: "3:53",
    genre: "Pop",
    year: 2017,
    views: "5.7B",
    thumbnail: `https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg`,
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    artist: "Luis Fonsi",
    duration: "4:41",
    genre: "Latin",
    year: 2017,
    views: "8.1B",
    thumbnail: `https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg`,
  },
  {
    id: "YQHsXMglC9A",
    title: "Adele - Hello",
    artist: "Adele",
    duration: "6:07",
    genre: "Pop",
    year: 2015,
    views: "3.2B",
    thumbnail: `https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg`,
  },
  {
    id: "09R8_2nJtjg",
    title: "Maroon 5 - Sugar",
    artist: "Maroon 5",
    duration: "3:55",
    genre: "Pop",
    year: 2014,
    views: "3.7B",
    thumbnail: `https://img.youtube.com/vi/09R8_2nJtjg/maxresdefault.jpg`,
  },
  {
    id: "RgKAFK5djSk",
    title: "Wiz Khalifa - See You Again ft. Charlie Puth",
    artist: "Wiz Khalifa",
    duration: "3:57",
    genre: "Hip Hop",
    year: 2015,
    views: "5.9B",
    thumbnail: `https://img.youtube.com/vi/RgKAFK5djSk/maxresdefault.jpg`,
  },
  {
    id: "CevxZvSJLk8",
    title: "Katy Perry - Roar",
    artist: "Katy Perry",
    duration: "3:43",
    genre: "Pop",
    year: 2013,
    views: "3.7B",
    thumbnail: `https://img.youtube.com/vi/CevxZvSJLk8/maxresdefault.jpg`,
  },
  {
    id: "nfs8NYg7yQM",
    title: "Imagine Dragons - Thunder",
    artist: "Imagine Dragons",
    duration: "3:07",
    genre: "Alternative",
    year: 2017,
    views: "2.3B",
    thumbnail: `https://img.youtube.com/vi/nfs8NYg7yQM/maxresdefault.jpg`,
  },
];

interface MusicVideo {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  year: number;
  views: string;
  thumbnail: string;
}

// Video Card Component
function VideoCard({
  video,
  onPlay,
}: {
  video: MusicVideo;
  onPlay: (video: MusicVideo) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group cursor-pointer" onClick={() => onPlay(video)}>
      <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-3 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        {!imageError ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <Play className="w-16 h-16 text-white/80" />
          </div>
        )}

        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-gray-400 text-xs">{video.artist}</p>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>{video.views} views</span>
          <span>•</span>
          <span>{video.year}</span>
        </div>
      </div>
    </div>
  );
}

// Filter Component
function FilterPanel({
  genres,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  isOpen,
  onToggle,
}: {
  genres: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <Toggle
        pressed={isOpen}
        onPressedChange={onToggle}
        variant="outline"
        className="border-gray-600 text-gray-300 hover:bg-gray-800"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </Toggle>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl z-50 min-w-64">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => onGenreChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
              >
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="year">Year</option>
                <option value="views">Views</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Player Modal Component
function PlayerModal({
  video,
  isOpen,
  onClose,
}: {
  video: MusicVideo | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-2">{video.title}</h2>
          <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {video.artist}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {video.duration}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {video.year}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              {video.genre}
            </span>
            <span className="text-gray-400 text-sm">{video.views} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function YouTubeMusicLibrary() {
  const [musicData] = useState<MusicVideo[]>(sampleMusicData);
  const [filteredData, setFilteredData] =
    useState<MusicVideo[]>(sampleMusicData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MusicVideo | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Get unique genres
  const genres = Array.from(
    new Set(musicData.map((video) => video.genre))
  ).sort();

  // Filter and sort data
  useEffect(() => {
    let filtered = musicData.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !selectedGenre || video.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "artist":
          return a.artist.localeCompare(b.artist);
        case "year":
          return b.year - a.year;
        case "views":
          const aViews = parseFloat(a.views.replace(/[^0-9.]/g, ""));
          const bViews = parseFloat(b.views.replace(/[^0-9.]/g, ""));
          return bViews - aViews;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredData(filtered);
  }, [musicData, searchQuery, selectedGenre, sortBy]);

  const handlePlayVideo = (video: MusicVideo) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-red-500">
              YouTube Music Library
            </h1>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search music..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-64"
                />
              </div>

              {/* Filters */}
              <FilterPanel
                genres={genres}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
                sortBy={sortBy}
                onSortChange={setSortBy}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-400">
            Showing {filteredData.length} of {musicData.length} videos
            {selectedGenre && (
              <span className="ml-2">
                in <span className="text-red-400">{selectedGenre}</span>
              </span>
            )}
          </p>

          {(searchQuery || selectedGenre) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("");
              }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Video Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredData.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={handlePlayVideo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No music found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>

      {/* Player Modal */}
      <PlayerModal
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />
    </div>
  );
}
