import { Cloudinary } from '@cloudinary/url-gen'
import { auto as qualityAuto } from '@cloudinary/url-gen/qualifiers/quality'
import { format } from '@cloudinary/url-gen/actions/delivery'
import { limitFit } from '@cloudinary/url-gen/actions/resize'
import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react'
import { useMemo } from 'react'

type PostImgProps = {
  post: {
    imgPublicId: string
    img: string
  }
}

const PostImg = ({ post }: PostImgProps) => {
  const optimizedPostImg = useMemo(() => {
    if (!post.imgPublicId) return null

    const cld = new Cloudinary({ cloud: { cloudName: 'ddkmhusml' } })

    return cld
      .image(post.imgPublicId)
      .delivery(format('auto'))
      .quality(qualityAuto())
      .resize(limitFit().width(600))
  }, [post.imgPublicId])

  return optimizedPostImg ? (
    <AdvancedImage
      cldImg={optimizedPostImg}
      plugins={[lazyload({ rootMargin: '10px', threshold: 0.2 }), placeholder({ mode: 'blur' })]}
      className="h-80 object-contain rounded-lg border border-gray-700"
      alt="Post Img"
    />
  ) : post.img ? (
    <img src="" alt="" />
  ) : null
}
export default PostImg
