'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase, type HeroSection, type Service, type Workshop, type Gallery, type Review } from '@/lib/supabase'
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react'

// Password Protection Component
function PasswordProtection({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'AnishaIndia') {
      onAuthenticated()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-gray-600">Enter password to access admin panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          
          <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
            Access Admin Panel
          </Button>
        </form>
      </Card>
    </div>
  )
}

// Image Upload Component
function ImageUpload({ onImageUploaded, currentImage }: { onImageUploaded: (url: string) => void, currentImage?: string }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    try {
      // Create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
      }
      reader.readAsDataURL(file)

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      onImageUploaded(data.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
          {uploading && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500"></div>
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          )}
        </div>
      </div>
      
      {preview && (
        <div className="mt-4">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [gallery, setGallery] = useState<Gallery[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    setLoading(true)
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

  const saveHeroSection = async (data: Partial<HeroSection>) => {
    try {
      const { error } = await supabase
        .from('hero_section')
        .upsert({ ...heroSection, ...data, updated_at: new Date().toISOString() })
      
      if (!error) {
        fetchData()
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving hero section:', error)
    }
  }

  const saveService = async (data: Partial<Service>) => {
    try {
      if (data.id) {
        const { error } = await supabase
          .from('services')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', data.id)
        if (!error) fetchData()
      } else {
        const { error } = await supabase
          .from('services')
          .insert({ ...data, display_order: services.length })
        if (!error) fetchData()
      }
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const saveWorkshop = async (data: Partial<Workshop>) => {
    try {
      if (data.id) {
        const { error } = await supabase
          .from('workshops')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', data.id)
        if (!error) fetchData()
      } else {
        const { error } = await supabase
          .from('workshops')
          .insert({ ...data, display_order: workshops.length })
        if (!error) fetchData()
      }
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving workshop:', error)
    }
  }

  const saveGallery = async (data: Partial<Gallery>) => {
    try {
      if (data.id) {
        const { error } = await supabase
          .from('gallery')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', data.id)
        if (!error) fetchData()
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert({ ...data, display_order: gallery.length })
        if (!error) fetchData()
      }
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving gallery item:', error)
    }
  }

  const saveReview = async (data: Partial<Review>) => {
    try {
      if (data.id) {
        const { error } = await supabase
          .from('reviews')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', data.id)
        if (!error) fetchData()
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert({ ...data, display_order: reviews.length })
        if (!error) fetchData()
      }
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving review:', error)
    }
  }

  const deleteItem = async (table: string, id: string) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (!error) fetchData()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex gap-4">
              <Button 
                onClick={() => window.open('/', '_blank')}
                variant="outline"
              >
                View Website
              </Button>
              <Button 
                onClick={() => setIsAuthenticated(false)}
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'hero', label: 'Hero Section' },
              { id: 'services', label: 'Services' },
              { id: 'workshops', label: 'Workshops' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'reviews', label: 'Reviews' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'hero' && (
          <HeroSectionEditor 
            heroSection={heroSection}
            onSave={saveHeroSection}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )}
        
        {activeTab === 'services' && (
          <ServicesEditor 
            services={services}
            onSave={saveService}
            onDelete={(id: string) => deleteItem('services', id)}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
          />
        )}

        {activeTab === 'workshops' && (
          <WorkshopsEditor 
            workshops={workshops}
            onSave={saveWorkshop}
            onDelete={(id: string) => deleteItem('workshops', id)}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryEditor 
            gallery={gallery}
            onSave={saveGallery}
            onDelete={(id: string) => deleteItem('gallery', id)}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsEditor 
            reviews={reviews}
            onSave={saveReview}
            onDelete={(id: string) => deleteItem('reviews', id)}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
          />
        )}
      </div>
    </div>
  )
}

// Hero Section Editor Component
function HeroSectionEditor({ heroSection, onSave, isEditing, setIsEditing }: {
  heroSection: HeroSection | null
  onSave: (data: Partial<HeroSection>) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
}) {
  const [formData, setFormData] = useState<Partial<HeroSection>>(heroSection || {})

  useEffect(() => {
    setFormData(heroSection || {})
  }, [heroSection])

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Hero Section</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary CTA Text</label>
            <Input
              value={formData.cta_primary_text || ''}
              onChange={(e) => setFormData({ ...formData, cta_primary_text: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Secondary CTA Text</label>
            <Input
              value={formData.cta_secondary_text || ''}
              onChange={(e) => setFormData({ ...formData, cta_secondary_text: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

// Services Editor Component
function ServicesEditor({ services, onSave, onDelete, editingItem, setEditingItem }: {
  services: Service[]
  onSave: (data: Partial<Service>) => void
  onDelete: (id: string) => void
  editingItem: string | null
  setEditingItem: (id: string | null) => void
}) {
  const [formData, setFormData] = useState<Partial<Service>>({})

  const startEdit = (service?: Service) => {
    setFormData(service || {
      title: '',
      description: '',
      points: [''],
      button_title: 'Learn More',
      modal_content: '',
      icon_emoji: '🧘',
      color_scheme: 'primary'
    })
    setEditingItem(service?.id || 'new')
  }

  const handleSave = () => {
    onSave(formData)
  }

  const updatePoints = (index: number, value: string) => {
    const newPoints = [...(formData.points || [])]
    newPoints[index] = value
    setFormData({ ...formData, points: newPoints })
  }

  const addPoint = () => {
    setFormData({ ...formData, points: [...(formData.points || []), ''] })
  }

  const removePoint = (index: number) => {
    const newPoints = (formData.points || []).filter((_: string, i: number) => i !== index)
    setFormData({ ...formData, points: newPoints })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
        <Button onClick={() => startEdit()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {editingItem && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {editingItem === 'new' ? 'Add New Service' : 'Edit Service'}
            </h3>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Icon Emoji</label>
                <Input
                  value={formData.icon_emoji || ''}
                  onChange={(e) => setFormData({ ...formData, icon_emoji: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Key Points</label>
              {(formData.points || []).map((point: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={point}
                    onChange={(e) => updatePoints(index, e.target.value)}
                    placeholder={`Point ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removePoint(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addPoint}>
                <Plus className="w-4 h-4 mr-2" />
                Add Point
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Button Title</label>
              <Input
                value={formData.button_title || ''}
                onChange={(e) => setFormData({ ...formData, button_title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Modal Content</label>
              <Textarea
                value={formData.modal_content || ''}
                onChange={(e) => setFormData({ ...formData, modal_content: e.target.value })}
                rows={6}
                placeholder="Detailed description that will appear in the modal..."
              />
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {services.map((service: Service) => (
          <Card key={service.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{service.icon_emoji}</span>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-2">{service.description}</p>
                <div className="text-sm text-gray-500">
                  Points: {service.points?.length || 0} | Button: {service.button_title}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(service)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(service.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Workshops Editor Component
function WorkshopsEditor({ workshops, onSave, onDelete, editingItem, setEditingItem }: {
  workshops: Workshop[]
  onSave: (data: Partial<Workshop>) => void
  onDelete: (id: string) => void
  editingItem: string | null
  setEditingItem: (id: string | null) => void
}) {
  const [formData, setFormData] = useState<Partial<Workshop>>({})

  const startEdit = (workshop?: Workshop) => {
    setFormData(workshop || {
      title: '',
      description: '',
      image_url: ''
    })
    setEditingItem(workshop?.id || 'new')
  }

  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, image_url: url })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workshops</h2>
        <Button onClick={() => startEdit()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Workshop
        </Button>
      </div>

      {editingItem && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {editingItem === 'new' ? 'Add New Workshop' : 'Edit Workshop'}
            </h3>
            <div className="flex gap-2">
              <Button onClick={() => onSave(formData)}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <ImageUpload 
              onImageUploaded={handleImageUploaded}
              currentImage={formData.image_url}
            />
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {workshops.map((workshop: Workshop) => (
          <Card key={workshop.id} className="p-4">
            <div className="flex gap-4">
              <img 
                src={workshop.image_url} 
                alt={workshop.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{workshop.title}</h3>
                <p className="text-gray-600">{workshop.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(workshop)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(workshop.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Gallery Editor Component
function GalleryEditor({ gallery, onSave, onDelete, editingItem, setEditingItem }: {
  gallery: Gallery[]
  onSave: (data: Partial<Gallery>) => void
  onDelete: (id: string) => void
  editingItem: string | null
  setEditingItem: (id: string | null) => void
}) {
  const [formData, setFormData] = useState<Partial<Gallery>>({})

  const startEdit = (item?: Gallery) => {
    setFormData(item || {
      image_url: '',
      alt_text: '',
      description: ''
    })
    setEditingItem(item?.id || 'new')
  }

  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, image_url: url })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <Button onClick={() => startEdit()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {editingItem && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {editingItem === 'new' ? 'Add New Image' : 'Edit Image'}
            </h3>
            <div className="flex gap-2">
              <Button onClick={() => onSave(formData)}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <ImageUpload 
              onImageUploaded={handleImageUploaded}
              currentImage={formData.image_url}
            />
            
            <div>
              <label className="block text-sm font-medium mb-2">Alt Text</label>
              <Input
                value={formData.alt_text || ''}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Description for accessibility"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((item: Gallery) => (
          <Card key={item.id} className="p-2">
            <img 
              src={item.image_url} 
              alt={item.alt_text}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <p className="text-sm text-gray-600 mb-2">{item.alt_text}</p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startEdit(item)}
                className="flex-1"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="flex-1"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Reviews Editor Component
function ReviewsEditor({ reviews, onSave, onDelete, editingItem, setEditingItem }: {
  reviews: Review[]
  onSave: (data: Partial<Review>) => void
  onDelete: (id: string) => void
  editingItem: string | null
  setEditingItem: (id: string | null) => void
}) {
  const [formData, setFormData] = useState<Partial<Review>>({})

  const startEdit = (review?: Review) => {
    setFormData(review || {
      name: '',
      rating: 5,
      text: '',
      therapy: ''
    })
    setEditingItem(review?.id || 'new')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <Button onClick={() => startEdit()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </div>

      {editingItem && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {editingItem === 'new' ? 'Add New Review' : 'Edit Review'}
            </h3>
            <div className="flex gap-2">
              <Button onClick={() => onSave(formData)}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={formData.rating || 5}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Therapy Type</label>
              <Input
                value={formData.therapy || ''}
                onChange={(e) => setFormData({ ...formData, therapy: e.target.value })}
                placeholder="e.g., Yoga Therapy, Ho'opono'pono"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Review Text</label>
              <Textarea
                value={formData.text || ''}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {reviews.map((review: Review) => (
          <Card key={review.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{review.name}</h3>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i: number) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-2">"{review.text}"</p>
                <p className="text-sm text-gray-500">{review.therapy}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(review)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }