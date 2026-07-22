import { Component, ElementRef, Renderer2, ViewChild, viewChild, inject, ChangeDetectorRef, AfterViewInit, ViewChildren, QueryList, RendererStyleFlags2, OnDestroy} from '@angular/core';
import { ProductService } from '../../service/product-service';

interface dotInterface {
  id:number;
}

interface Item {
  id:number;
  title:string;
  brand:string;
  price:any;
  installments?:string;
  stock:number;
  rating:number;
  category:string;
  description:string;
  images?:string;
  sales:number;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements AfterViewInit, OnDestroy{
  @ViewChild('slideWrapper') slideWrapper!:ElementRef
  @ViewChild('arrowBack') arrowBack!:ElementRef
  @ViewChild('arrowNext') arrowNext!:ElementRef
  @ViewChildren('dots') dots!: QueryList<ElementRef>
  // @ViewChild('productWrapper') productWrapper!:ElementRef
  @ViewChildren('productWrapper') productWrapper!: QueryList<ElementRef>
  @ViewChildren('sectionBack') sectionBackList!: QueryList<ElementRef>
  @ViewChildren('sectionNext') sectionNextList!: QueryList<ElementRef>
  // @ViewChild('sectionBack') sectionBack!:ElementRef
  // @ViewChild('sectionNext') sectionNext!:ElementRef  

  next:number = 0
  back:number = 0
  length:number = 0
  slideTime = 0
  dotsArray:dotInterface[] = []
  children:any
  arrayProductWrapper:any
  slideProduct:any
  sectionBack:any
  sectionNext:any
  totalRan = 0
  scroll:number = 0
  scrollSize:number = 0
  lastScroll:number = 0
  sectionAnimation: any
  allProduct:Item[]=[]
  hotOffers:Item[]=[]
  peripherals:Item[]=[]
  setup:Item[]=[]
  currencyBR:string = ''
  rating:string[] = []

  constructor(private renderer:Renderer2){}
  private cdr = inject(ChangeDetectorRef)
  private itemService = inject(ProductService)


  ngAfterViewInit () {
    setTimeout(() => {
      if(this.slideWrapper && this.slideWrapper.nativeElement) {
        this.slideAnimation()

        this.sectionSlideAnimation()

      }
    }, 100)
    
    this.children = Array.from(this.slideWrapper.nativeElement.children)

    this.dotsArray = this.children.map((el:any, index:number) => {
      return {
        id: index
      }
    })

    this.showProducts()
    this.cdr.detectChanges()
  }

  ngOnDestroy(): void {
    clearInterval(this.sectionAnimation)
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

  sectionItemNext(section:HTMLElement,sectionNext:HTMLElement) {
    const visibleWidth = section.clientWidth
    let scrollPositionX = section.scrollLeft
    const scrollTotal = section.scrollWidth - visibleWidth
    this.totalRan = (scrollPositionX / scrollTotal) * 100

    const scrollWidth = section.scrollWidth
    this.scrollSize = (scrollWidth / section.children.length)
        
    if(this.totalRan < 100) {
      this.scroll = this.scrollSize
      section.scrollBy( {
        left: this.scroll,
        behavior: 'smooth'
      })

      if(this.lastScroll < 400) {
        this.renderer.setStyle(sectionNext, 'display', 'none')
      } else if(this.lastScroll > 400) {
        this.renderer.setStyle(sectionNext, 'display', 'flex')
      }
      
    } 
    
  }

  sectionItemBack(section:HTMLElement) {
    const visibleWidth = section.clientWidth
    let scrollPositionX = section.scrollLeft
    const scrollTotal = section.scrollWidth - visibleWidth
    this.totalRan = (scrollPositionX / scrollTotal) * 100

    const scrollWidth = section.scrollWidth
    this.scrollSize = (scrollWidth / section.children.length)

    if(this.totalRan > 0 ) {
      this.scroll = -this.scrollSize
      section.scrollBy( {
        left: this.scroll,
        behavior: 'smooth'
      })

    }
    
  }

  visibleArrow(section:HTMLElement, sectionBack:HTMLElement, sectionNext:HTMLElement) {
    const visibleWidth = section.clientWidth
    let scrollPositionX = section.scrollLeft
    const scrollTotal = section.scrollWidth - visibleWidth
    this.totalRan = (scrollPositionX / scrollTotal) * 100

    this.lastScroll = scrollTotal - this.totalRan
    const remaiderScroll = scrollTotal - scrollPositionX

    if(visibleWidth >= 400) {
      if(remaiderScroll > 100) {
        this.renderer.setStyle(sectionNext, 'display', 'flex')
      } else {
        this.renderer.setStyle(sectionNext, 'display', 'none')
      }

      if((scrollTotal - 100) > remaiderScroll) {
        this.renderer.setStyle(sectionBack, 'display', 'flex')
      } else {
        this.renderer.setStyle(sectionBack, 'display', 'none')
      }
    } else {
      if(remaiderScroll > 60) {
        this.renderer.setStyle(sectionNext, 'display', 'flex')
      } else {
        this.renderer.setStyle(sectionNext, 'display', 'none')
      }

      if((scrollTotal - 60) > remaiderScroll) {
        this.renderer.setStyle(sectionBack, 'display', 'flex')
      } else {
        this.renderer.setStyle(sectionBack, 'display', 'none')
      }
    }

  }

  sectionSlideAnimation() {    
    
    this.sectionAnimation = setInterval(()=> {

      this.sectionBackList.toArray().forEach((el:ElementRef)=> {
        this.sectionBack = el.nativeElement
      })
        this.sectionNextList.toArray().forEach((el:ElementRef)=> {
        this.sectionNext = el.nativeElement
      })
      this.arrayProductWrapper = this.productWrapper.toArray()
      
      if(this.totalRan < 100){

        this.arrayProductWrapper.forEach((element:ElementRef) => {
          this.slideProduct = element.nativeElement
          this.sectionItemNext(this.slideProduct, this.sectionNext)
        })

      } else if (this.totalRan >= 100){

        this.arrayProductWrapper.forEach((element:ElementRef) => {
          this.slideProduct = element.nativeElement
          this.slideProduct.scrollTo( {
          left: 0,
          behavior: 'smooth'
          })

        this.totalRan = 0
        this.cdr.detectChanges()

        })
        
      }
    
    }, 5800)
    
  }

  showProducts() {
    this.itemService.getProducts().subscribe((data:any) => {
      for(let i = 0; i < data.length; i++) {
        this.allProduct.push(data[i])

        this.cdr.detectChanges()
        
      }

      this.hotOffers = this.allProduct.filter(item => item.sales > 1800)
      
      this.peripherals = this.allProduct.filter( item => {
        return item.category === 'Periferico'
      })

      this.setup = this.allProduct.filter( item => {
        return item.category === 'Setup'
      })
      
      this.currencyToBR(this.allProduct)
    })
  }

  currencyToBR(section:any) {
    section.forEach( (item:any, index:number) => {
      this.currencyConverter(section[index].price / 10)
      section[index].installments =  this.currencyBR
    })

    section.forEach((item:any, index:number) => {
      this.currencyConverter(section[index].price)
      section[index].price = this.currencyBR
    })
      
    this.cdr.detectChanges()
  }


  currencyConverter(valor:number) {
    const price = valor
    this.currencyBR = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)

  }

  rate(rate:number) {  
    const int = Math.trunc(rate)
    this.rating = ['empty','empty','empty','empty','empty']

    for(let i = 0; i < int; i++) {
      this.rating[i] = 'full'

      if(rate % 1 !== 0 ) {
        this.rating[int] = 'half'
      }
      
    }
  
  }

  
}
