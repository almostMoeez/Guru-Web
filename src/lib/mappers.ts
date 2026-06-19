import type { MenuItem, MenuCategory, CustomizationOption } from '../types';
import type { ApiCategoryGroup, ApiMenuItem } from './api/types';
import { toAmount } from './currency';

// Shown when a backend item has no image.
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop';

// Resolve an item's image to a usable <img src>: prefer imageUrl, then a base64
// payload (raw or data URI) if present, otherwise the fallback.
const resolveImage = (item: ApiMenuItem): string => {
  if (item.imageUrl && item.imageUrl.trim()) return item.imageUrl;
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
  };
};

/** Flatten GET /menu (categories with nested items) into a flat MenuItem[]. */
export const mapMenu = (groups: ApiCategoryGroup[]): MenuItem[] =>
  groups.flatMap((group) =>
    (group.items ?? []).map((item) =>
      mapMenuItem(item, String(group.id), group.name),
    ),
  );

/** Derive the ordered category tab list from the grouped menu response. */
export const mapCategories = (groups: ApiCategoryGroup[]): MenuCategory[] =>
  [...groups]
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((group) => ({
      id: String(group.id),
      name: group.name,
      displayOrder: group.displayOrder ?? undefined,
    }));
