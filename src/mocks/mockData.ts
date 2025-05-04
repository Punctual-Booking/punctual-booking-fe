/**
 * Centralized mock data store
 *
 * This file contains all mock data used throughout the application.
 * All mock services should import from this file to ensure consistency.
 */

import { StaffMember } from '@/types/staff'
import { Service } from '@/types/service'
import { BUSINESS_ID } from '@/config'

/**
 * Mock staff data
 */
export const mockStaffData: StaffMember[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@example.com',
    phone: '912345678',
    image: '/images/staff/maria.jpg',
    specialties: ['Coloração', 'Tratamentos Capilares', 'Penteados'],
    services: ['1', '2', '3', '5'],
    yearsOfExperience: 8,
    isActive: true,
    businessId: BUSINESS_ID,
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@example.com',
    phone: '923456789',
    image: '/images/staff/joao.jpg',
    specialties: ['Corte Masculino', 'Barba', 'Penteados Masculinos'],
    services: ['1', '4', '6'],
    yearsOfExperience: 5,
    isActive: true,
    businessId: BUSINESS_ID,
  },
  {
    id: '3',
    name: 'Ana Ferreira',
    email: 'ana.ferreira@example.com',
    phone: '934567890',
    image: '/images/staff/ana.jpg',
    specialties: ['Manicure', 'Pedicure', 'Unhas de Gel'],
    services: ['7', '8', '9'],
    yearsOfExperience: 10,
    isActive: true,
    businessId: BUSINESS_ID,
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@example.com',
    phone: '945678901',
    image: '/images/staff/pedro.jpg',
    specialties: ['Coloração', 'Corte Masculino', 'Barba'],
    services: ['1', '2', '4', '6'],
    yearsOfExperience: 7,
    isActive: true,
    businessId: BUSINESS_ID,
  },
  {
    id: '5',
    name: 'Sofia Costa',
    email: 'sofia.costa@example.com',
    phone: '956789012',
    image: '/images/staff/sofia.jpg',
    specialties: ['Maquilhagem', 'Penteados', 'Tratamentos Faciais'],
    services: ['3', '10', '11'],
    yearsOfExperience: 6,
    isActive: true,
    businessId: BUSINESS_ID,
  },
]

/**
 * Mock service data
 */
export const mockServiceData: Service[] = [
  {
    id: '1',
    name: 'Corte de Cabelo',
    description: 'Corte de cabelo profissional com lavagem e styling.',
    price: 25,
    duration: 30,
    image: '/images/services/haircut.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '2',
    name: 'Coloração',
    description: 'Coloração completa com produtos profissionais.',
    price: 75,
    duration: 120,
    image: '/images/services/coloring.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '3',
    name: 'Penteado',
    description: 'Penteado para eventos especiais.',
    price: 50,
    duration: 60,
    image: '/images/services/styling.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '4',
    name: 'Barba',
    description: 'Aparar e desenhar a barba.',
    price: 15,
    duration: 20,
    image: '/images/services/beard.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '5',
    name: 'Tratamento Capilar',
    description: 'Tratamento intensivo para cabelos danificados.',
    price: 45,
    duration: 45,
    image: '/images/services/treatment.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '6',
    name: 'Corte Masculino',
    description: 'Corte de cabelo masculino com lavagem.',
    price: 20,
    duration: 25,
    image: '/images/services/mens_haircut.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '7',
    name: 'Manicure',
    description: 'Tratamento e pintura das unhas das mãos.',
    price: 18,
    duration: 30,
    image: '/images/services/manicure.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '8',
    name: 'Pedicure',
    description: 'Tratamento e pintura das unhas dos pés.',
    price: 25,
    duration: 45,
    image: '/images/services/pedicure.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '9',
    name: 'Unhas de Gel',
    description: 'Aplicação de unhas de gel.',
    price: 40,
    duration: 60,
    image: '/images/services/gel_nails.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '10',
    name: 'Maquilhagem',
    description: 'Maquilhagem profissional para eventos.',
    price: 55,
    duration: 60,
    image: '/images/services/makeup.jpg',
    businessId: BUSINESS_ID,
  },
  {
    id: '11',
    name: 'Tratamento Facial',
    description: 'Limpeza e hidratação facial.',
    price: 45,
    duration: 60,
    image: '/images/services/facial.jpg',
    businessId: BUSINESS_ID,
  },
]
