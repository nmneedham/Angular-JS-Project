import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CountryService } from '../country.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  svgMap: SafeHtml | null = null;
  selectedCountry: any = null;
  loading = true;
  error: string | null = null;
  
  constructor(
    private http: HttpClient,
    private countryService: CountryService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log('Map component initialized');
    this.loadSvgMap();
  }

  loadSvgMap(): void {
    console.log('Attempting to load SVG map');
    this.http.get('assets/world-map.svg', { responseType: 'text' })
      .subscribe({
        next: (data) => {
          console.log('SVG loaded successfully, length:', data.length);
          this.svgMap = this.sanitizer.bypassSecurityTrustHtml(data);
          this.loading = false;
          setTimeout(() => this.setupMapInteractivity(), 100);
        },
        error: (err) => {
          console.error('Error loading SVG map:', err);
          this.error = `Failed to load map: ${err.message}`;
          this.loading = false;
        }
      });
  }

  setupMapInteractivity(): void {
    console.log('Setting up map interactivity');
    const svgElement = document.querySelector('#map-container svg');
    if (!svgElement) {
      console.error('SVG element not found in DOM');
      return;
    }
    
    const countries = svgElement.querySelectorAll('path');
    console.log(`Found ${countries.length} country paths`);
    
    countries.forEach(country => {
      country.addEventListener('click', (event) => {
        const target = event.target as SVGPathElement;
        const countryCode = target.getAttribute('id');
        if (countryCode) {
          console.log(`Country clicked: ${countryCode}`);
          this.getCountryInfo(countryCode);
          
          // Reset all countries to default fill
          countries.forEach(c => {
            (c as SVGPathElement).style.fill = '';
          });
          
          // Highlight selected country
          target.style.fill = '#4285f4';
        }
      });
      
      // Add hover effects
      country.addEventListener('mouseenter', (event) => {
        const target = event.target as SVGPathElement;
        if (!this.selectedCountry || target.getAttribute('id') !== this.selectedCountry.id) {
          target.style.fill = '#a0c8ff';
        }
      });
      
      country.addEventListener('mouseleave', (event) => {
        const target = event.target as SVGPathElement;
        if (!this.selectedCountry || target.getAttribute('id') !== this.selectedCountry.id) {
          target.style.fill = '';
        }
      });
    });
  }

  getCountryInfo(countryCode: string): void {
    console.log(`Fetching info for country: ${countryCode}`);
    this.countryService.getCountryData(countryCode).subscribe({
      next: (data) => {
        console.log('Country data received:', data);
        this.selectedCountry = data;
      },
      error: (err) => {
        console.error('Error fetching country data:', err);
        this.error = `Failed to load country data: ${err.message}`;
      }
    });
  }
}