"use client"

import { useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Testimonial = {
  name: string
  company: string
  quote: string
  rating: number
  avatar?: string
}

interface EmblaCarouselProps {
  testimonials: Testimonial[]
  autoPlay?: boolean
  interval?: number
}

export function EmblaCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
}: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  // Auto-play
  useEffect(() => {
    if (!emblaApi || !autoPlay) return

    const timer = setInterval(() => {
      emblaApi.scrollNext()
    }, interval)

    return () => clearInterval(timer)
  }, [emblaApi, autoPlay, interval])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex-[0_0_100%] min-w-0 px-4 md:px-6"
            >
              <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all h-full">
                <div className="flex items-center gap-4 mb-5">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-lg">{t.name}</h4>
                    <p className="text-sm text-muted-foreground">{t.company}</p>
                  </div>
                </div>

                <div className="flex mb-5">
                  {[...Array(5)].map((_, star) => (
                    <span
                      key={star}
                      className={cn(
                        "text-xl",
                        star < t.rating ? "text-yellow-400" : "text-gray-300"
                      )}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed italic text-base md:text-lg">
                  "{t.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm border shadow-md hover:bg-background"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm border shadow-md hover:bg-background"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots (optional – uncomment if you want) */}
      {/* <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              emblaApi?.selectedScrollSnap() === i ? "bg-primary w-6" : "bg-muted"
            )}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div> */}
    </div>
  )
}