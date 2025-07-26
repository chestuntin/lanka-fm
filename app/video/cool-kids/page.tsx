"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Play,
  Clock,
  User,
  Calendar,
  X,
  Music,
  TrendingUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
    featured: true,
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
    featured: false,
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
    featured: false,
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
    featured: true,
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
    featured: true,
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
    featured: false,
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
    featured: true,
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
    featured: false,
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
    featured: false,
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
    featured: true,
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
    featured: false,
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
    featured: false,
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
  featured: boolean;
}

// Video Card Component with Glassmorphism
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
    <Card
      className="group cursor-pointer border-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden relative"
      onClick={() => onPlay(video)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" />

      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 -z-10" />

      <CardContent className="p-0 relative z-10">
        <div className="relative aspect-video rounded-t-lg overflow-hidden">
          {!imageError ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600/80 via-pink-600/80 to-blue-600/80 backdrop-blur-sm flex items-center justify-center">
              <Music className="w-16 h-16 text-white/80" />
            </div>
          )}

          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm animate-pulse" />
          )}

          {/* Liquid glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          {/* Duration badge */}
          <Badge
            variant="outline"
            className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm border-white/20 text-white font-medium px-2 py-1 text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            {video.duration}
          </Badge>

          {/* Featured badge */}
          {video.featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold border-0 px-2 py-1 text-xs">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}

          {/* Play button with liquid effect */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="relative">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl scale-150 animate-pulse" />
              {/* Main button */}
              <Button
                size="lg"
                className="relative bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white rounded-full p-4 transition-all duration-300 transform hover:scale-110"
              >
                <Play className="w-8 h-8 fill-current" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content section with glass effect */}
        <div className="p-4 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
            {video.title}
          </h3>
          <p className="text-gray-300 text-xs mb-3 flex items-center">
            <User className="w-3 h-3 mr-1" />
            {video.artist}
          </p>

          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-400/30 text-purple-200 text-xs"
            >
              {video.genre}
            </Badge>

            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <span className="flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {video.views}
              </span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {video.year}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Filter Component with Glass Effect
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
      <Button
        variant="outline"
        onClick={onToggle}
        className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl z-50 min-w-72 p-6">
          <CardContent className="space-y-6 p-0">
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Genre
              </label>
              <Select value={selectedGenre} onValueChange={onGenreChange}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                  <SelectItem value="" className="text-white hover:bg-white/10">
                    All Genres
                  </SelectItem>
                  {genres.map((genre) => (
                    <SelectItem
                      key={genre}
                      value={genre}
                      className="text-white hover:bg-white/10"
                    >
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-white/20" />

            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                  <SelectItem
                    value="title"
                    className="text-white hover:bg-white/10"
                  >
                    Title
                  </SelectItem>
                  <SelectItem
                    value="artist"
                    className="text-white hover:bg-white/10"
                  >
                    Artist
                  </SelectItem>
                  <SelectItem
                    value="year"
                    className="text-white hover:bg-white/10"
                  >
                    Year
                  </SelectItem>
                  <SelectItem
                    value="views"
                    className="text-white hover:bg-white/10"
                  >
                    Views
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Player Modal Component with Enhanced Glass Effect
function PlayerModal({
  video,
  isOpen,
  onClose,
}: {
  video: MusicVideo | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full bg-black/20 backdrop-blur-2xl border-white/20 text-white p-0 overflow-hidden">
        {video && (
          <>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                title={video.title}
                className="w-full h-full rounded-t-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-8 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text">
                  {video.title}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-purple-400" />
                    <span className="text-lg font-medium">{video.artist}</span>
                  </div>

                  <div className="flex items-center space-x-6 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{video.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{video.year}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                      {video.genre}
                    </Badge>

                    <div className="flex items-center space-x-2 text-gray-300">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{video.views} views</span>
                    </div>
                  </div>

                  {video.featured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold border-0 px-4 py-2">
                      <Star className="w-4 h-4 mr-2 fill-current" />
                      Featured Track
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Header with Glass Effect */}
      <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text">
                YouTube Music Library
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search with Glass Effect */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search music..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 backdrop-blur-lg border-white/20 rounded-full pl-12 pr-6 py-3 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 w-80 transition-all duration-300"
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
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Stats with Glass Effect */}
        <Card className="mb-8 bg-white/5 backdrop-blur-lg border-white/10 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <p className="text-gray-300 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                  Showing{" "}
                  <span className="font-semibold text-white mx-1">
                    {filteredData.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white mx-1">
                    {musicData.length}
                  </span>{" "}
                  videos
                  {selectedGenre && (
                    <Badge className="ml-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border-purple-400/30">
                      {selectedGenre}
                    </Badge>
                  )}
                </p>
              </div>

              {(searchQuery || selectedGenre) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre("");
                  }}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Video Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredData.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={handlePlayVideo}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl">
            <CardContent className="text-center py-20">
              <div className="text-8xl mb-6 opacity-50">🎵</div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                No music found
              </h3>
              <p className="text-gray-400 text-lg">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Player Modal */}
      <PlayerModal
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
