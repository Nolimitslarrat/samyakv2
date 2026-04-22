'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './ImageGallery.module.css'

export default function ImageGallery({ images = [], status }) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    // Handle key press for navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return

            if (e.key === 'Escape') setIsOpen(false)
            if (e.key === 'ArrowLeft') showPrev(e)
            if (e.key === 'ArrowRight') showNext(e)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, currentIndex])

    const openLightbox = (index) => {
        setCurrentIndex(index)
        setIsOpen(true)
        document.body.style.overflow = 'hidden'
    }

    const closeLightbox = () => {
        setIsOpen(false)
        document.body.style.overflow = 'unset'
    }

    const showPrev = (e) => {
        e?.stopPropagation()
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const showNext = (e) => {
        e?.stopPropagation()
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
    }

    if (!images.length) return null

    return (
        <>
            <div className={styles.gallery}>
                <div className={styles.mainImage} onClick={() => openLightbox(0)}>
                    <Image
                        src={images[0]}
                        alt="Property Main View"
                        fill
                        className={styles.img}
                        priority
                    />
                    {status && <div className={styles.statusBadge}>{status}</div>}
                </div>

                <div className={styles.thumbnails}>
                    {images.slice(1, 4).map((img, idx) => (
                        <div key={idx} className={styles.thumb} onClick={() => openLightbox(idx + 1)}>
                            <Image
                                src={img}
                                alt={`Property View ${idx + 2}`}
                                fill
                                className={styles.img}
                            />
                            {idx === 2 && images.length > 4 && (
                                <div className={styles.moreCount}>+{images.length - 4}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {isOpen && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.closeBtn} onClick={closeLightbox}>
                        <X size={24} />
                    </button>

                    <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={showPrev}>
                        <ChevronLeft size={28} />
                    </button>

                    <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                        <Image
                            src={images[currentIndex]}
                            alt={`Full view ${currentIndex + 1}`}
                            fill
                            className={styles.fullImg}
                            quality={100}
                            priority
                        />
                    </div>

                    <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={showNext}>
                        <ChevronRight size={28} />
                    </button>

                    <div className={styles.counter}>
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    )
}
