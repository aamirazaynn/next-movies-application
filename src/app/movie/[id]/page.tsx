import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/server/Header";
import FavoriteButton from "@/components/client/FavoriteButton";
import ErrorMessage from "@/components/server/ErrorMessage";
import ScrollToTop from "@/components/client/ScrollToTop";
import { getMovieDetails, isApiKeyConfigured } from "@/lib/api";
import {
  getPosterUrl,
  formatYear,
  formatRuntime,
  formatRating,
} from "@/lib/utils";
import type { MovieDetails } from "@/types/movie";
import styles from "./page.module.scss";
import { Star } from "lucide-react";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  let movie: MovieDetails | null = null;
  let error: string | null = null;

  if (!isApiKeyConfigured()) {
    return (
      <>
        <ScrollToTop />
        <Header />
        <main className={styles.main}>
          <ErrorMessage message="API key not configured. Please set NEXT_PUBLIC_OMDB_API_KEY in your environment variables." />
        </main>
      </>
    );
  }

  try {
    const result = await getMovieDetails(id);

    if ("Error" in result && result.Error) {
      error = result.Error;
    } else if ("Response" in result && result.Response === "True") {
      movie = result as MovieDetails;
    } else {
      notFound();
    }
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Failed to fetch movie details";
  }

  if (error) {
    return (
      <>
        <ScrollToTop />
        <Header />
        <main className={styles.main}>
          <ErrorMessage message={error} />
        </main>
      </>
    );
  }

  if (!movie) {
    notFound();
  }

  const posterUrl = getPosterUrl(movie.Poster);

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className={styles.main}>
        <article className={styles.movieDetails}>
          <div className={styles.posterSection}>
            <div className={styles.posterContainer}>
              <Image
                src={posterUrl}
                alt={`${movie.Title} poster`}
                width={400}
                height={600}
                className={styles.poster}
              />
            </div>
            <div className={styles.favoriteSection}>
              <FavoriteButton movie={movie} variant="text" />
            </div>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>{movie.Title}</h1>
              <div className={styles.meta}>
                <span>{formatYear(movie.Year)}</span>
                {movie.Runtime && (
                  <span>{formatRuntime(movie.Runtime)} min</span>
                )}
                {movie.imdbRating && (
                  <span className={styles.rating}>
                    <Star fill="currentColor" />
                    {formatRating(movie.imdbRating)}
                  </span>
                )}
              </div>
            </div>

            {movie.Plot && (
              <section className={styles.section}>
                <h2>Plot</h2>
                <p>{movie.Plot}</p>
              </section>
            )}

            <div className={styles.detailsGrid}>
              {movie.Genre && (
                <div className={styles.detailItem}>
                  <h3>Genre</h3>
                  <p>{movie.Genre}</p>
                </div>
              )}

              {movie.Director && (
                <div className={styles.detailItem}>
                  <h3>Director</h3>
                  <p>{movie.Director}</p>
                </div>
              )}

              {movie.Actors && (
                <div className={styles.detailItem}>
                  <h3>Cast</h3>
                  <p>{movie.Actors}</p>
                </div>
              )}
            </div>

            {movie.Ratings && movie.Ratings.length > 0 && (
              <section className={styles.section}>
                <h2>Ratings</h2>
                <div className={styles.ratingsList}>
                  {movie.Ratings.map((rating, index) => (
                    <div key={index} className={styles.ratingItem}>
                      <span className={styles.ratingSource}>
                        {rating.Source}
                      </span>
                      <span className={styles.ratingValue}>{rating.Value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
    </>
  );
}
