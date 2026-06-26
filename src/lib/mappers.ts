import type {
  MenuItem,
  MenuCategoryGroup,
  CustomizationOption,
} from '../types';
import type { ApiCategoryGroup, ApiMenuItem } from './api/types';
import { toAmount } from './currency';
import { API_BASE_URL } from './config';

// Shown when a backend item has no image (or its image fails to load).
export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop';

// Resolve an item's image to a usable <img src>: prefer imageUrl (the backend
// serves images statically from its root, so relative paths get the API base
// prepended), then a base64 payload, otherwise the fallback.
const resolveImage = (item: ApiMenuItem): string => {
  const url = item.imageUrl?.trim();
  if (url) {
    if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
    return `${API_BASE_URL}/${url.replace(/^\/+/, '')}`;
  }
  const b64 = item.imageBase64;
  if (b64 && b64.trim()) {
    return b64.startsWith('data:') ? b64 : `data:image/jpeg;base64,${b64}`;
  }
  return FALLBACK_IMAGE;
};

/** Map a backend menu item's modifier groups into the UI's customization options. */
const mapOptions = (item: ApiMenuItem): CustomizationOption[] | undefined => {
  if (!item.modifiers?.length) return undefined;

  const options = item.modifiers
    .map((m) => m.modifierGroup)
    .filter(Boolean)
    .map<CustomizationOption>((group) => ({
      name: group.name,
      modifierGroupId: group.id,
      required: group.minSelection > 0,
      choices: (group.items ?? []).map((mi) => ({
        name: mi.name,
        extraPrice: toAmount(mi.extraPrice),
        modifierItemId: mi.id,
      })),
    }))
    .filter((opt) => opt.choices.length > 0);

  return options.length ? options : undefined;
};

/** Convert one backend item (within a category group) to a frontend MenuItem. */
export const mapMenuItem = (
  item: ApiMenuItem,
  categoryId: string,
  categoryName: string,
): MenuItem => {
  const options = mapOptions(item);
  const tags = (item.tags ?? [])
    .map((t) => t.name?.toLowerCase().trim())
    .filter((n): n is string => Boolean(n));
  return {
    id: String(item.id),
    name: item.name,
    description: item.description ?? '',
    price: toAmount(item.basePrice),
    category: String(item.categoryId ?? categoryId),
    categoryName,
    image: resolveImage(item),
    customizable: Boolean(options),
    customizationOptions: options,
    tags: tags.length ? tags : undefined,
  };
};

// Tag names that mark an item as a "signature"/featured pick.
const SIGNATURE_TAGS = [
  'signature',
  'featured',
  'popular',
  'bestseller',
  'best seller',
  "chef's pick",
  'chef pick',
  'special',
];

/**
 * Pick items to showcase on the home page. Prefers tagged signature/featured
 * items; falls back to the first available items so the section is never empty.
 */
export const selectSignatureItems = (
  groups: MenuCategoryGroup[],
  count = 4,
): MenuItem[] => {
  const all = groups.flatMap((g) => g.subcategories.flatMap((s) => s.items));
  const tagged = all.filter((i) => i.tags?.some((t) => SIGNATURE_TAGS.includes(t)));
  return (tagged.length ? tagged : all).slice(0, count);
};

/**
 * Map GET /menu (category groups → subcategories → items) into the UI tree.
 * Subcategories with no items are dropped; groups left empty are dropped too.
 */
export const mapMenu = (groups: ApiCategoryGroup[]): MenuCategoryGroup[] =>
  groups
    .map((group) => ({
      id: String(group.id),
      name: group.name,
      subcategories: (group.subcategories ?? [])
        .map((sub) => ({
          id: String(sub.id),
          name: sub.name,
          items: (sub.items ?? []).map((item) =>
            mapMenuItem(item, String(sub.id), sub.name),
          ),
        }))
        .filter((sub) => sub.items.length > 0),
    }))
    .filter((group) => group.subcategories.length > 0);
