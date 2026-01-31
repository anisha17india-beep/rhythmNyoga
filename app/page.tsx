'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { ChevronLeft, ChevronRight, Star, Send } from 'lucide-react'
import Link from 'next/link'
import { supabase, type HeroSection, type Service, type Workshop, type Gallery, type Review } from '@/lib/supabase'

// Workshop Carousel Component
function WorkshopCarousel({ workshops }: { workshops: Workshop[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (workshops.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % workshops.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [workshops.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % workshops.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + workshops.length) % workshops.length)

  if (workshops.length === 0) {
    return (
      <section id="workshops" className="py-12 sm:py-20 bg-gradient-to-b from-transparent to-gray-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-bold text-3xl sm:text-5xl mb-3 sm:mb-4 text-balance">Upcoming Workshops</h2>
            <p className="text-base sm:text-lg text-gray-600 text-pretty">Join our monthly wellness sessions</p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No workshops available. Check back soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="workshops" className="py-12 sm:py-20 bg-gradient-to-b from-transparent to-gray-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-bold text-3xl sm:text-5xl mb-3 sm:mb-4 text-balance">Upcoming Workshops</h2>
          <p className="text-base sm:text-lg text-gray-600 text-pretty">Join our monthly wellness sessions</p>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-2 sm:px-4">
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {workshops.map((workshop) => (
                <div key={workshop.id} className="min-w-full">
                  <div className="relative h-64 sm:h-96 md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden group">
                    <img src={workshop.image_url || "/placeholder.svg"} alt={workshop.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 text-white">
                      <h4 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 text-balance">{workshop.title}</h4>
                      <p className="text-sm sm:text-base md:text-lg md:text-xl text-white/90 text-pretty">{workshop.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-teal-400 transition-all flex items-center justify-center group" aria-label="Previous slide">
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
          </button>

          <button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-teal-400 transition-all flex items-center justify-center group" aria-label="Next slide">
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
          </button>

          <div className="flex justify-center gap-2 mt-4 sm:mt-6">
            {workshops.map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-teal-500' : 'w-2 bg-gray-300 hover:bg-teal-400/50'}`} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Photo Gallery Component
function PhotoGallery({ gallery }: { gallery: Gallery[] }) {
  if (gallery.length === 0) {
    return (
      <section id="gallery" className="py-12 sm:py-20 bg-gradient-to-b from-transparent to-gray-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-bold text-3xl sm:text-5xl mb-3 sm:mb-4 text-balance">Our Gallery</h2>
            <p className="text-base sm:text-lg text-gray-600 text-pretty mb-4 sm:mb-6">
              Moments of transformation, joy, and healing
            </p>
            <div className="inline-block px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-teal-400/5 to-teal-300/5 border border-teal-400/20">
              <p className="text-xs sm:text-sm text-teal-600 font-medium">
                Update gallery images from the <Link href="/admin" className="underline font-bold">Admin Panel</Link>
              </p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No gallery images available. Add some from the admin panel!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-12 sm:py-20 bg-gradient-to-b from-transparent to-gray-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-bold text-3xl sm:text-5xl mb-3 sm:mb-4 text-balance">Our Gallery</h2>
          <p className="text-base sm:text-lg text-gray-600 text-pretty mb-4 sm:mb-6">
            Moments of transformation, joy, and healing
          </p>
          <div className="inline-block px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-teal-400/5 to-teal-300/5 border border-teal-400/20">
            <p className="text-xs sm:text-sm text-teal-600 font-medium">
              Update gallery images from the <Link href="/admin" className="underline font-bold">Admin Panel</Link>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {gallery.map((image) => (
            <div key={image.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-teal-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-400/10">
              <img src={image.image_url || "/placeholder.svg"} alt={image.alt_text} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {image.description && (
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm">{image.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Reviews Carousel Component
function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [currentReview, setCurrentReview] = useState(0)

  useEffect(() => {
    if (reviews.length > 0) {
      const timer = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length)
      }, 6000)
      return () => clearInterval(timer)
    }
  }, [reviews.length])

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length)
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)

  if (reviews.length === 0) {
    return (
      <section id="reviews" className="py-12 sm:py-20 bg-gradient-to-b from-gray-50/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-bold text-3xl sm:text-5xl mb-3 sm:mb-4 text-balance">Client Reviews</h2>
            <p className="text-base sm:text-lg text-gray-600 text-pretty">Real stories from our happy clients</p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews available yet. Add some from the admin panel!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="reviews" className="py-12 sm:py-20 bg-gradient-to-b from-gray-50/20 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-bold text-3xl sm:text-5xl mb-3 sm:mb-4 text-balance">Client Reviews</h2>
          <p className="text-base sm:text-lg text-gray-600 text-pretty">Real stories from our happy clients</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-2 sm:px-4">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentReview * 100}%)` }}>
              {reviews.map((review) => (
                <div key={review.id} className="min-w-full px-2 sm:px-4">
                  <Card className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-white via-white to-gray-50/10">
                    <div className="flex gap-1 mb-6 justify-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 sm:w-6 h-5 sm:h-6 fill-teal-500 text-teal-500" />
                      ))}
                    </div>
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8 text-center text-balance italic">
                      {`"${review.text}"`}
                    </p>
                    <div className="text-center">
                      <div className="font-bold text-lg sm:text-xl">{review.name}</div>
                      <div className="text-sm text-gray-500">{review.therapy}</div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <button onClick={prevReview} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-teal-400 transition-all flex items-center justify-center group" aria-label="Previous review">
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
          </button>

          <button onClick={nextReview} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-teal-400 transition-all flex items-center justify-center group" aria-label="Next review">
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
          </button>

          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {reviews.map((_, index) => (
              <button key={index} onClick={() => setCurrentReview(index)} className={`h-2 rounded-full transition-all ${index === currentReview ? 'w-8 bg-teal-500' : 'w-2 bg-gray-300 hover:bg-teal-400/50'}`} aria-label={`Go to review ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Journey Form Component
function JourneyForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('https://formspree.io/f/maqjgvva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          _subject: `New wellness inquiry from ${formData.name}`,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          setFormData({ name: '', phone: '', message: '' })
          setIsSubmitted(false)
        }, 5000)
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending form:', error)
      alert('There was an error sending your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (isSubmitted) {
    return (
      <section id="journey" className="py-12 sm:py-20 bg-gradient-to-b from-transparent to-gray-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50/50 shadow-xl">
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Send className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
              </div>
              <h4 className="font-bold text-2xl sm:text-3xl mb-2 sm:mb-3 text-gray-900">Thank You!</h4>
              <p className="text-base sm:text-lg text-gray-600">
                We received your message and will get back to you soon.
              </p>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="journey" className="py-12 sm:py-20 bg-gradient-to-b from-transparent to-gray-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50/50 shadow-xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl mb-3 sm:mb-4 text-balance">Start Your Wellness Journey</h2>
            <p className="text-base sm:text-lg text-gray-600 text-pretty">
              Ready to transform your life? Let&apos;s connect and create a personalized wellness plan for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your full name" 
                className="w-full rounded-2xl border-2 border-gray-300 focus:border-teal-400 bg-white px-4 py-3 text-gray-900" 
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input 
                id="phone" 
                name="phone" 
                type="tel" 
                required 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Enter your phone number" 
                className="w-full rounded-2xl border-2 border-gray-300 focus:border-teal-400 bg-white px-4 py-3 text-gray-900" 
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about your wellness goals
              </label>
              <Textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Share what brings you here and what you hope to achieve..." 
                rows={5} 
                className="w-full rounded-2xl border-2 border-gray-300 focus:border-teal-400 bg-white px-4 py-3 text-gray-900 resize-none" 
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full rounded-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-semibold py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Send className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Sending...' : 'Start My Journey'}
            </Button>

            <p className="text-xs sm:text-sm text-center text-gray-500">
              We respect your privacy and will never share your information
            </p>
          </form>
        </Card>
      </div>
    </section>
  )
}

// Main Component
export default function RhythmYogaWellness() {
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [gallery, setGallery] = useState<Gallery[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [heroRes, servicesRes, workshopsRes, galleryRes, reviewsRes] = await Promise.all([
        supabase.from('hero_section').select('*').single(),
        supabase.from('services').select('*').order('display_order'),
        supabase.from('workshops').select('*').order('display_order'),
        supabase.from('gallery').select('*').order('display_order'),
        supabase.from('reviews').select('*').order('display_order')
      ])

      if (heroRes.data) setHeroSection(heroRes.data)
      if (servicesRes.data) setServices(servicesRes.data)
      if (workshopsRes.data) setWorkshops(workshopsRes.data)
      if (galleryRes.data) setGallery(galleryRes.data)
      if (reviewsRes.data) setReviews(reviewsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="font-bold text-lg sm:text-2xl text-gray-900">
            Rhythm N Yoga
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#services" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">Services</a>
            <a href="#workshops" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">Workshops</a>
            <a href="#gallery" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">Gallery</a>
            <a href="#reviews" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">Reviews</a>
            <a href="#journey" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">Start Journey</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-transparent via-transparent to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl mb-3 sm:mb-6 text-balance leading-tight">
              {heroSection?.title || 'Heal Naturally'}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-600 mb-6 sm:mb-8 text-pretty max-w-3xl mx-auto">
              {heroSection?.description || 'Transform your mind, body, and spirit through holistic wellness therapies'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Button size="lg" asChild className="rounded-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 px-6 sm:px-8 text-white font-semibold w-full sm:w-auto">
                <a href="#journey">{heroSection?.cta_primary_text || 'Start Your Journey'}</a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-2 border-teal-400 text-teal-600 hover:bg-teal-50 bg-transparent w-full sm:w-auto">
                <a href="#services">{heroSection?.cta_secondary_text || 'Explore Therapies'}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-bold text-3xl sm:text-5xl mb-3 sm:mb-4 text-balance">Our Services</h2>
            <p className="text-base sm:text-lg text-gray-600 text-pretty">Comprehensive wellness solutions tailored to your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => (
              <Card key={service.id} className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-gray-200 hover:border-teal-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-400/5 bg-gradient-to-br from-white to-gray-50/50 flex flex-col">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">{service.icon_emoji}</span>
                </div>
                <h4 className="font-bold text-xl sm:text-2xl mb-2 sm:mb-3">{service.title}</h4>
                <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                  {service.description}
                </p>
                <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 flex-grow">
                  {service.points?.map((point, index) => (
                    <p key={index}>• {point}</p>
                  ))}
                </div>
                <Button 
                  className="w-full rounded-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white text-sm sm:text-base mt-auto"
                  onClick={() => setSelectedService(service)}
                >
                  {service.button_title}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workshops Section */}
      <WorkshopCarousel workshops={workshops} />

      {/* Gallery Section */}
      <PhotoGallery gallery={gallery} />

      {/* Reviews Section */}
      <ReviewsCarousel reviews={reviews} />

      {/* Journey Section */}
      <JourneyForm />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-2xl sm:text-3xl mb-4 text-white">Rhythm N Yoga</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Transform your mind, body, and spirit through holistic wellness therapies. 
                Experience natural healing with personalized yoga therapy, Ho&apos;opono&apos;pono, 
                flower remedies, and dance therapy.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-teal-500 hover:bg-teal-400 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-teal-500 hover:bg-teal-400 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-teal-500 hover:bg-teal-400 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="text-gray-300 hover:text-teal-400 transition-colors">Our Services</a></li>
                <li><a href="#workshops" className="text-gray-300 hover:text-teal-400 transition-colors">Workshops</a></li>
                <li><a href="#gallery" className="text-gray-300 hover:text-teal-400 transition-colors">Gallery</a></li>
                <li><a href="#reviews" className="text-gray-300 hover:text-teal-400 transition-colors">Reviews</a></li>
                <li><a href="#journey" className="text-gray-300 hover:text-teal-400 transition-colors">Start Journey</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-teal-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-teal-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">info@rhythmnyoga.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-teal-400 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 Rhythm N Yoga. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Service Modal */}
      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.title || ''}
      >
        {selectedService && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selectedService.icon_emoji}</span>
              <h3 className="text-xl font-semibold">{selectedService.title}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {selectedService.modal_content}
            </p>
            <div className="pt-4">
              <Button 
                className="w-full rounded-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white"
                onClick={() => {
                  setSelectedService(null)
                  document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}