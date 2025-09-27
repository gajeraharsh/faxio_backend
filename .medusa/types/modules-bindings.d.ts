import type VariantImagesSettings from 'medusa-variant-images/.medusa/server/src/modules/variant-images-settings'
import type { IStockLocationService } from '@medusajs/framework/types'
import type { IInventoryService } from '@medusajs/framework/types'
import type { IProductModuleService } from '@medusajs/framework/types'
import type { IPricingModuleService } from '@medusajs/framework/types'
import type { IPromotionModuleService } from '@medusajs/framework/types'
import type { ICustomerModuleService } from '@medusajs/framework/types'
import type { ISalesChannelModuleService } from '@medusajs/framework/types'
import type { ICartModuleService } from '@medusajs/framework/types'
import type { IRegionModuleService } from '@medusajs/framework/types'
import type { IApiKeyModuleService } from '@medusajs/framework/types'
import type { IStoreModuleService } from '@medusajs/framework/types'
import type { ITaxModuleService } from '@medusajs/framework/types'
import type { ICurrencyModuleService } from '@medusajs/framework/types'
import type { IPaymentModuleService } from '@medusajs/framework/types'
import type { IOrderModuleService } from '@medusajs/framework/types'
import type { IAuthModuleService } from '@medusajs/framework/types'
import type { IUserModuleService } from '@medusajs/framework/types'
import type { IFulfillmentModuleService } from '@medusajs/framework/types'
import type { INotificationModuleService } from '@medusajs/framework/types'
import type { ICacheService } from '@medusajs/framework/types'
import type { IEventBusModuleService } from '@medusajs/framework/types'
import type { IWorkflowEngineService } from '@medusajs/framework/types'
import type { ILockingModule } from '@medusajs/framework/types'
import type { IFileModuleService } from '@medusajs/framework/types'
import type Review from '../../src/modules/review'
import type Blog from '../../src/modules/blog'
import type Reels from '../../src/modules/reels'
import type Wishlist from '../../src/modules/wishlist'
import type Newsletter from '../../src/modules/newsletter'
import type Contact from '../../src/modules/contact'
import type Banner from '../../src/modules/banner'
import type Verification from '../../src/modules/verification'

declare module '@medusajs/framework/types' {
  interface ModuleImplementations {
    'variant_images_settings': InstanceType<(typeof VariantImagesSettings)['service']>,
    'stock_location': IStockLocationService,
    'inventory': IInventoryService,
    'product': IProductModuleService,
    'pricing': IPricingModuleService,
    'promotion': IPromotionModuleService,
    'customer': ICustomerModuleService,
    'sales_channel': ISalesChannelModuleService,
    'cart': ICartModuleService,
    'region': IRegionModuleService,
    'api_key': IApiKeyModuleService,
    'store': IStoreModuleService,
    'tax': ITaxModuleService,
    'currency': ICurrencyModuleService,
    'payment': IPaymentModuleService,
    'order': IOrderModuleService,
    'auth': IAuthModuleService,
    'user': IUserModuleService,
    'fulfillment': IFulfillmentModuleService,
    'notification': INotificationModuleService,
    'cache': ICacheService,
    'event_bus': IEventBusModuleService,
    'workflows': IWorkflowEngineService,
    'locking': ILockingModule,
    'file': IFileModuleService,
    'review': InstanceType<(typeof Review)['service']>,
    'blog': InstanceType<(typeof Blog)['service']>,
    'reels': InstanceType<(typeof Reels)['service']>,
    'wishlist': InstanceType<(typeof Wishlist)['service']>,
    'newsletter': InstanceType<(typeof Newsletter)['service']>,
    'contact': InstanceType<(typeof Contact)['service']>,
    'banner': InstanceType<(typeof Banner)['service']>,
    'verification': InstanceType<(typeof Verification)['service']>
  }
}