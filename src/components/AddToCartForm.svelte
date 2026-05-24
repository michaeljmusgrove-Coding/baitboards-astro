<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import { addCartItem, isCartUpdating, cart } from "../stores/cart";
  import { addToCart as ga4AddToCart } from "../utils/dataLayer";

  interface Props {
    variantId: string;
    variantQuantityAvailable: number;
    variantAvailableForSale: boolean;
    productId?: string;
    productName?: string;
    productPrice?: number;
    productHandle?: string;
    productBrand?: string;
  }

  let {
    variantId,
    variantQuantityAvailable,
    variantAvailableForSale,
    productId,
    productName,
    productPrice,
    productHandle,
    productBrand = 'SeaKing',
  }: Props = $props();

  // Check if the variant is already in the cart and if there are any units left
  let variantInCart =
    $derived($cart &&
    $cart.lines?.nodes.filter((item) => item.merchandise.id === variantId)[0]);
  let noQuantityLeft =
    $derived(variantInCart && variantQuantityAvailable <= variantInCart?.quantity);

  function addToCart(e: Event) {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const { id, quantity } = Object.fromEntries(formData);
    const qty = parseInt(quantity as string);
    const item = {
      id: id as string,
      quantity: qty,
    };
    // GA4 add_to_cart push — fires before the network call so even if the
    // Storefront mutation fails the intent is still measurable. The cart
    // store will fire its own error state in the UI on failure.
    if (productName && productHandle) {
      ga4AddToCart({
        item_id: productHandle,
        item_name: productName,
        price: productPrice,
        quantity: qty,
        item_brand: productBrand,
      });
    }
    addCartItem(item);
  }
</script>

<form onsubmit={preventDefault((e) => addToCart(e))}>
  <input type="hidden" name="id" value={variantId} />
  <input type="hidden" name="quantity" value="1" />

  <button
    type="submit"
    class="button-accent mt-10 w-full"
    disabled={$isCartUpdating || noQuantityLeft || !variantAvailableForSale}
  >
    {#if $isCartUpdating}
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    {/if}
    {#if variantAvailableForSale}
      Add to cart
    {:else}
      Sold out
    {/if}
  </button>
  {#if noQuantityLeft}
    <div class="text-center text-red-600">
      <small>All units left are in your cart</small>
    </div>
  {/if}
</form>
