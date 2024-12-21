import { Routes } from '@angular/router';
import { CardCreationComponent } from './features/card/components/card-creation/card-creation.component';
import { CardRechargeComponent } from './features/card/components/card-recharge/card-recharge.component';
import { CardListComponent } from './features/card/components/card-list/card-list.component';
import { ProductListComponent } from './features/marketplace/components/product-list/product-list.component';
import { CheckoutComponent } from './features/marketplace/components/checkout/checkout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/marketplace', pathMatch: 'full' },
    { path: 'cards/create', component: CardCreationComponent },
    { path: 'cards/recharge', component: CardRechargeComponent },
    { path: 'cards/transactions', component: CardListComponent },
    { path: 'marketplace', component: ProductListComponent },
    { path: 'checkout', component: CheckoutComponent }
];