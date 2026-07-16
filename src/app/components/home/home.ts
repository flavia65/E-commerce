import { Component, ElementRef, Renderer2, ViewChild, viewChild, inject, ChangeDetectorRef, AfterViewInit, ViewChildren, QueryList, RendererStyleFlags2 } from '@angular/core';

interface dotInterface {
  id:number;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit{
  @ViewChild('slideWrapper') slideWrapper!:ElementRef
  @ViewChild('arrowBack') arrowBack!:ElementRef
  @ViewChild('arrowNext') arrowNext!:ElementRef
  @ViewChildren('dots') dots!: QueryList<ElementRef>
  @ViewChild('productWrapper') productWrapper!:ElementRef
  // @ViewChildren('productWrapper') productList!: QueryList<ElementRef>
  @ViewChild('sectionBack') sectionBack!:ElementRef
  @ViewChild('sectionNext') sectionNext!:ElementRef

  next:number = 0
  back:number = 0
  length:number = 0
  slideTime = 0
  dotsArray:dotInterface[] = []
  children:any
  totalRan = 0
  scroll:number = 0
  sectionInterval:any
  lastScroll: number = 0
  constructor(private renderer:Renderer2){}
  private cdr = inject(ChangeDetectorRef)


  ngAfterViewInit () {
    
    setTimeout(() => {
      if(this.slideWrapper && this.slideWrapper.nativeElement) {
        this.slideAnimation()
        // setTimeout(() => {
        //   this.sectionSlideAnimation()
        // }, 5800)
        this.sectionSlideAnimation()

      }
    }, 100)
    
    this.children = Array.from(this.slideWrapper.nativeElement.children)

    this.dotsArray = this.children.map((el:any, index:number) => {
      return {
        id: index
      }
    })

    if(this.totalRan <= 0) {
          
      this.renderer.setStyle(this.sectionBack.nativeElement, 'display', 'none', RendererStyleFlags2.Important)
    }


  }

  slideAnimation () {
    this.length = this.slideWrapper.nativeElement.children.length - 1

    this.dots.get(0)?.nativeElement.classList.add('active')

    this.slideTime = setInterval(()=> {
     if (this.next >= (this.length) * 100){
      this.next = 0
      this.renderer.setStyle(this.slideWrapper.nativeElement, 'transform', `translateX(-${this.next}%)`)
      this.renderer.setStyle(this.slideWrapper.nativeElement, 'transition', 'transform 1.2s ease', RendererStyleFlags2.Important)

      this.dotAnimation()
     } else {
      this.nextSlide()
     }
    }, 5800)
    this.cdr.detectChanges()
    
  }

 
  dotNavigation (dot:HTMLSpanElement) {
    clearInterval(this.slideTime)
    this.dots.forEach(e => {
      e.nativeElement.classList.remove('active')
    })

    this.renderer.addClass(dot,'active')

    this.dots.forEach((el, index) => {
      if(el.nativeElement.classList.contains('active')) {

        
        let dotTransform = index * 100
        console.log(index)
        this.renderer.setStyle(this.slideWrapper.nativeElement, 'transform', `translateX(-${dotTransform}%)`)
        this.renderer.setStyle(this.slideWrapper.nativeElement, 'transition', 'transform 1.2s ease', RendererStyleFlags2.Important)
        
    }
    })

    setTimeout(()=> {
      this.next = 0
      this.renderer.setStyle(this.slideWrapper.nativeElement, 'transform', `translateX(-${this.next}%)`)
      this.renderer.setStyle(this.slideWrapper.nativeElement, 'transition', 'transform 1.2s ease', RendererStyleFlags2.Important)

      this.dots.forEach(e => {
      e.nativeElement.classList.remove('active')
      })
      this.dots.get(0)?.nativeElement.classList.add('active')

      this.slideAnimation()
      }, 5800)
    
    this.cdr.detectChanges()
  }

  

  nextSlide() {
    if(this.next < this.length * 100 ) {
      this.next += 100
      this.renderer.setStyle(this.slideWrapper.nativeElement, 'transform', `translateX(-${this.next}%)`)
      this.renderer.setStyle(this.slideWrapper.nativeElement, 'transition', 'transform 1.2s ease', RendererStyleFlags2.Important)


      this.dotAnimation()
    }
    
  }

  backSlide() {
    if(this.next > 0) {
      this.next -= 100
      this.renderer.setStyle(this.slideWrapper.nativeElement, 'transform', `translateX(-${this.next}%)`)
      this.renderer.setStyle(this.slideWrapper.nativeElement, 'transition', 'transform 1.2s ease', RendererStyleFlags2.Important)


      this.dotAnimation()
    }
  }

  dotAnimation () {
     const slideIndex = this.next / 100

      this.dots.forEach(e => {
        e.nativeElement.classList.remove('active')
        this.dots.get(slideIndex)?.nativeElement.classList.add('active')    
      })
  }

  sectionItemNext() {
    const visibleWidth = this.productWrapper.nativeElement.clientWidth
    let scrollPositionX = this.productWrapper.nativeElement.scrollLeft
    const scrollTotal = this.productWrapper.nativeElement.scrollWidth - visibleWidth
    this.totalRan = (scrollPositionX / scrollTotal) * 100


    // clearInterval (this.sectionInterval)
    
    
    if(this.totalRan < 100 && visibleWidth >= 400) {
      this.scroll = 300
      this.productWrapper.nativeElement.scrollBy( {
        left: this.scroll,
        behavior: 'smooth'
      })

      if(this.lastScroll < 400) {
        this.renderer.setStyle(this.sectionNext.nativeElement, 'display', 'none')
      } else if(this.lastScroll > 400) {
        this.renderer.setStyle(this.sectionNext.nativeElement, 'display', 'flex')
      }
      

      console.log('bigger' + visibleWidth, 'position' + scrollPositionX, scrollTotal, this.totalRan)

      // setTimeout (()=> {
      // this.sectionSlideAnimation()
      // }, 5800)
    } else if(this.totalRan < 100 && visibleWidth < 400) {
      this.scroll = 240
      this.productWrapper.nativeElement.scrollBy( {
        left: this.scroll,
        behavior: 'smooth'
      })

      console.log('smaller' + visibleWidth, this.scroll)
    //   setTimeout (()=> {
    //   this.sectionSlideAnimation()
    // }, 5800)
    }

    
    
  }

  sectionItemBack() {
    const visibleWidth = this.productWrapper.nativeElement.clientWidth
    let scrollPositionX = this.productWrapper.nativeElement.scrollLeft
    const scrollTotal = this.productWrapper.nativeElement.scrollWidth - visibleWidth
    this.totalRan = (scrollPositionX / scrollTotal) * 100

    // clearInterval (this.sectionInterval)

    if(this.totalRan > 0 && visibleWidth >= 400) {
      this.scroll = -300
      this.productWrapper.nativeElement.scrollBy( {
        left: this.scroll,
        behavior: 'smooth'
      })

      console.log( scrollTotal - this.totalRan)
      // setTimeout (()=> {
      // this.sectionSlideAnimation()
      // }, 2800)
    } else if(this.totalRan < 100 && visibleWidth < 400) {
      this.scroll = -240
      this.productWrapper.nativeElement.scrollBy( {
        left: this.scroll,
        behavior: 'smooth'
      })

      console.log('smaller' + visibleWidth, this.scroll)
      // setTimeout (()=> {
      // this.sectionSlideAnimation()
      // }, 5800)
    }
    
  }

  visibleArrow() {
    const visibleWidth = this.productWrapper.nativeElement.clientWidth
    let scrollPositionX = this.productWrapper.nativeElement.scrollLeft
    const scrollTotal = this.productWrapper.nativeElement.scrollWidth - visibleWidth
    this.totalRan = (scrollPositionX / scrollTotal) * 100

    this.lastScroll = scrollTotal - this.totalRan
    const remaiderScroll = scrollTotal - scrollPositionX

    if(visibleWidth >= 400) {
      if(remaiderScroll > 100) {
        this.renderer.setStyle(this.sectionNext.nativeElement, 'display', 'flex')
      } else {
        this.renderer.setStyle(this.sectionNext.nativeElement, 'display', 'none')
      }

    if((scrollTotal - 100) > remaiderScroll) {
        this.renderer.setStyle(this.sectionBack.nativeElement, 'display', 'flex')
      } else {
        this.renderer.setStyle(this.sectionBack.nativeElement, 'display', 'none')
      }
    } else {
      if(remaiderScroll > 60) {
      this.renderer.setStyle(this.sectionNext.nativeElement, 'display', 'flex')
    } else {
      this.renderer.setStyle(this.sectionNext.nativeElement, 'display', 'none')
    }

    if((scrollTotal - 60) > remaiderScroll) {
      this.renderer.setStyle(this.sectionBack.nativeElement, 'display', 'flex')
    } else {
      this.renderer.setStyle(this.sectionBack.nativeElement, 'display', 'none')
    }
    }


    
    
  }

  sectionSlideAnimation() {
    // clearInterval (this.sectionInterval)
    
    
    this.sectionInterval = setInterval(()=> {
      
      if(this.totalRan < 100){

        this.sectionItemNext()
        
        console.log('total:'+ this.totalRan)
      } else if (this.totalRan >= 100){
        
        this.productWrapper.nativeElement.scrollTo( {
        left: 0,
        behavior: 'smooth'
        })
        this.totalRan = 0
        this.cdr.detectChanges()
      }
    
    }, 5800)
    
  }

}
