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
  MoreHorizontal,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample YouTube music data - replace with your actual data
const sampleMusicData = [
  {
    id: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    duration: "3:33",
    genre: "Pop",
    year: 1987,
    views: "1.4B",
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
    featured: true,
  },
  {
    id: "9bZkp7q19f0",
    title: "GANGNAM STYLE",
    artist: "PSY",
    duration: "4:13",
    genre: "K-Pop",
    year: 2012,
    views: "4.8B",
    thumbnail: `https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg`,
    featured: false,
  },
  {
    id: "L_jWHffIx5E",
    title: "All Star",
    artist: "Smash Mouth",
    duration: "3:21",
    genre: "Rock",
    year: 1999,
    views: "500M",
    thumbnail: `https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg`,
    featured: false,
  },
  {
    id: "hT_nvWreIhg",
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    genre: "R&B",
    year: 2019,
    views: "3.2B",
    thumbnail: `https://img.youtube.com/vi/hT_nvWreIhg/hqdefault.jpg`,
    featured: true,
  },
  {
    id: "fJ9rUzIMcZQ",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    duration: "5:55",
    genre: "Rock",
    year: 1975,
    views: "1.8B",
    thumbnail: `https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg`,
    featured: true,
  },
  {
    id: "JGwWNGJdvx8",
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: "3:53",
    genre: "Pop",
    year: 2017,
    views: "5.7B",
    thumbnail: `https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg`,
    featured: false,
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Despacito ft. Daddy Yankee",
    artist: "Luis Fonsi",
    duration: "4:41",
    genre: "Latin",
    year: 2017,
    views: "8.1B",
    thumbnail: `https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg`,
    featured: false,
  },
  {
    id: "YQHsXMglC9A",
    title: "Hello",
    artist: "Adele",
    duration: "6:07",
    genre: "Pop",
    year: 2015,
    views: "3.2B",
    thumbnail: `https://img.youtube.com/vi/YQHsXMglC9A/hqdefault.jpg`,
    featured: false,
  },
  {
    id: "09R8_2nJtjg",
    title: "Sugar",
    artist: "Maroon 5",
    duration: "3:55",
    genre: "Pop",
    year: 2014,
    views: "3.7B",
    thumbnail: `https://img.youtube.com/vi/09R8_2nJtjg/hqdefault.jpg`,
    featured: false,
  },
  {
    id: "RgKAFK5djSk",
    title: "See You Again ft. Charlie Puth",
    artist: "Wiz Khalifa",
    duration: "3:57",
    genre: "Hip Hop",
    year: 2015,
    views: "5.9B",
    thumbnail: `https://img.youtube.com/vi/RgKAFK5djSk/hqdefault.jpg`,
    featured: true,
  },
  {
    id: "CevxZvSJLk8",
    title: "Roar",
    artist: "Katy Perry",
    duration: "3:43",
    genre: "Pop",
    year: 2013,
    views: "3.7B",
    thumbnail: `https://img.youtube.com/vi/CevxZvSJLk8/hqdefault.jpg`,
    featured: false,
  },
  {
    id: "nfs8NYg7yQM",
    title: "Thunder",
    artist: "Imagine Dragons",
    duration: "3:07",
    genre: "Alternative",
    year: 2017,
    views: "2.3B",
    thumbnail: `https://img.youtube.com/vi/nfs8NYg7yQM/hqdefault.jpg`,
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

// Stats Card Component
function StatsCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}

// Video Card Component (Grid View)
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
      className="group cursor-pointer bg-card border-border hover:bg-accent/50 transition-colors duration-200"
      onClick={() => onPlay(video)}
    >
      <CardContent className="p-4">
        <div className="relative aspect-video rounded-md overflow-hidden mb-4 bg-muted">
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
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Music className="w-12 h-12 text-muted-foreground" />
            </div>
          )}

          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <Play className="w-6 h-6 fill-current" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>

          {video.featured && (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-500 text-white">
              Featured
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground">{video.artist}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{video.views} views</span>
            <span>{video.year}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Video Row Component (List View)
function VideoRow({
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
      className="group cursor-pointer bg-card border-border hover:bg-accent/50 transition-colors duration-200"
      onClick={() => onPlay(video)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Music className="w-6 h-6 text-muted-foreground" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-sm truncate">{video.title}</h3>
              {video.featured && (
                <Badge className="bg-orange-500 hover:bg-orange-500 text-white text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{video.artist}</p>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span>{video.duration}</span>
            <span>{video.views}</span>
            <span>{video.year}</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
      <DialogContent className="max-w-4xl w-full bg-card border-border">
        {video && (
          <>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-xl">{video.title}</DialogTitle>
              </DialogHeader>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{video.artist}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{video.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{video.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{video.views} views</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{video.genre}</Badge>
                {video.featured && (
                  <Badge className="bg-orange-500 hover:bg-orange-500 text-white">
                    Featured
                  </Badge>
                )}
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
  const [selectedVideo, setSelectedVideo] = useState<MusicVideo | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique genres
  const genres = Array.from(
    new Set(musicData.map((video) => video.genre))
  ).sort();

  // Calculate stats
  const totalViews = musicData.reduce((acc, video) => {
    const views = parseFloat(video.views.replace(/[^0-9.]/g, ""));
    return acc + views;
  }, 0);

  const featuredCount = musicData.filter((video) => video.featured).length;
  const averageYear = Math.round(
    musicData.reduce((acc, video) => acc + video.year, 0) / musicData.length
  );

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Music className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Music Library</h1>
          </div>

          <div className="flex flex-1 items-center space-x-4 justify-end">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search music..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedGenre || "all"}
              onValueChange={(value) =>
                setSelectedGenre(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="views">Views</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Videos"
            value={musicData.length.toString()}
            change="All time favorites"
            icon={Music}
          />
          <StatsCard
            title="Total Views"
            value={`${totalViews.toFixed(1)}B`}
            change="Across all videos"
            icon={TrendingUp}
          />
          <StatsCard
            title="Featured"
            value={featuredCount.toString()}
            change="Hand-picked tracks"
            icon={Star}
          />
          <StatsCard
            title="Average Year"
            value={averageYear.toString()}
            change="Collection span"
            icon={Calendar}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="library" className="space-y-6">
          <TabsList>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {musicData.length} videos
              </p>

              {(searchQuery || selectedGenre) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre("");
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear filters
                </Button>
              )}
            </div>

            {filteredData.length > 0 ? (
              <div className="space-y-4">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredData.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onPlay={handlePlayVideo}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredData.map((video) => (
                      <VideoRow
                        key={video.id}
                        video={video}
                        onPlay={handlePlayVideo}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="text-center py-12">
                  <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No music found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="featured">
            <div className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {musicData
                    .filter((video) => video.featured)
                    .map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onPlay={handlePlayVideo}
                      />
                    ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {musicData
                    .filter((video) => video.featured)
                    .map((video) => (
                      <VideoRow
                        key={video.id}
                        video={video}
                        onPlay={handlePlayVideo}
                      />
                    ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {musicData
                    .filter((video) => video.year >= 2015)
                    .map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onPlay={handlePlayVideo}
                      />
                    ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {musicData
                    .filter((video) => video.year >= 2015)
                    .map((video) => (
                      <VideoRow
                        key={video.id}
                        video={video}
                        onPlay={handlePlayVideo}
                      />
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Player Modal */}
      <PlayerModal
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />

      <style jsx global>{`
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
