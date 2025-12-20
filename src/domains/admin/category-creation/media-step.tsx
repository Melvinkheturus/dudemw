"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Upload, Loader2, Image as ImageIcon, Video, X } from "lucide-react"
import Image from "next/image"
import { CategoryService } from '@/lib/services/categories'

interface CategoryFormData {
  homepage_thumbnail_url: string
  homepage_video_url: string
  plp_square_thumbnail_url: string
}

interface MediaStepProps {
  formData: CategoryFormData
  onFormDataChange: (updates: Partial<CategoryFormData>) => void
}

export function MediaStep({ formData, onFormDataChange }: MediaStepProps) {
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingSquareThumbnail, setUploadingSquareThumbnail] = useState(false)

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'homepage_thumbnail' | 'homepage_video' | 'plp_square_thumbnail'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const setUploading = {
      homepage_thumbnail: setUploadingThumbnail,
      homepage_video: setUploadingVideo,
      plp_square_thumbnail: setUploadingSquareThumbnail
    }[type]

    setUploading(true)

    try {
      const result = await CategoryService.uploadImage(file, 'image')
      if (result.success && result.url) {
        onFormDataChange({
          [`${type}_url`]: result.url
        })
        toast.success(`${type.replace('_', ' ')} uploaded successfully`)
      } else {
        toast.error(result.error || 'Failed to upload')
      }
    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const removeMedia = (type: 'homepage_thumbnail' | 'homepage_video' | 'plp_square_thumbnail') => {
    onFormDataChange({
      [`${type}_url`]: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Homepage Display Media */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Homepage Display</CardTitle>
          <p className="text-sm text-gray-600">Configure how this category appears on the homepage</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Homepage Thumbnail */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Homepage Thumbnail *
              </Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50/50">
                {formData.homepage_thumbnail_url ? (
                  <div className="relative group">
                    <Image
                      src={formData.homepage_thumbnail_url}
                      alt="Homepage thumbnail"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia('homepage_thumbnail')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-700 mb-2">Upload homepage thumbnail</p>
                    <p className="text-xs text-gray-500 mb-4">Recommended: 800x600px, JPG or PNG</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'homepage_thumbnail')}
                      disabled={uploadingThumbnail}
                      className="hidden"
                      id="homepage-thumbnail"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={uploadingThumbnail} 
                      className="w-full"
                      onClick={() => document.getElementById('homepage-thumbnail')?.click()}
                    >
                      {uploadingThumbnail ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Homepage Video (Optional) */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Homepage Video (Optional)
              </Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50/50">
                {formData.homepage_video_url ? (
                  <div className="relative group">
                    <video
                      src={formData.homepage_video_url}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48"
                      controls
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia('homepage_video')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-700 mb-2">Upload homepage video</p>
                    <p className="text-xs text-gray-500 mb-4">Recommended: MP4, max 10MB</p>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleImageUpload(e, 'homepage_video')}
                      disabled={uploadingVideo}
                      className="hidden"
                      id="homepage-video"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={uploadingVideo} 
                      className="w-full"
                      onClick={() => document.getElementById('homepage-video')?.click()}
                    >
                      {uploadingVideo ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PLP Display Media */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Product Listing Page (PLP) Display</CardTitle>
          <p className="text-sm text-gray-600">Configure how this category appears on product listing pages</p>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Square Category Thumbnail *
              </Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50/50">
                {formData.plp_square_thumbnail_url ? (
                  <div className="relative group">
                    <Image
                      src={formData.plp_square_thumbnail_url}
                      alt="PLP square thumbnail"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-full aspect-square"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia('plp_square_thumbnail')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-700 mb-2">Upload square thumbnail</p>
                    <p className="text-xs text-gray-500 mb-4">Required: 1:1 ratio (e.g., 400x400px)</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'plp_square_thumbnail')}
                      disabled={uploadingSquareThumbnail}
                      className="hidden"
                      id="plp-thumbnail"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={uploadingSquareThumbnail} 
                      className="w-full"
                      onClick={() => document.getElementById('plp-thumbnail')?.click()}
                    >
                      {uploadingSquareThumbnail ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}