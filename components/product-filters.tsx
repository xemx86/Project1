import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

type Props = {
  lang: Locale;
  categories: string[];
  colors: string[];
  materials: string[];
  current: {
    q: string;
    category: string;
    color: string;
    material: string;
    sort: string;
  };
};

export async function ProductFilters({
  lang,
  categories,
  colors,
  materials,
  current,
}: Props) {
  const dict = await getDictionary(lang);

  return (
    <aside className="filters panel">
      <h3>{dict.filters.title}</h3>

      <form className="filters__group" action={`/${lang}/sklep`}>
        <label>
          {dict.filters.search}
          <input
            name="q"
            defaultValue={current.q}
            placeholder={dict.filters.searchPlaceholder}
          />
        </label>

        <label>
          {dict.filters.category}
          <select name="category" defaultValue={current.category}>
            <option value="">{dict.filters.all}</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label>
          {dict.filters.color}
          <select name="color" defaultValue={current.color}>
            <option value="">{dict.filters.all}</option>
            {colors.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label>
          {dict.filters.material}
          <select name="material" defaultValue={current.material}>
            <option value="">{dict.filters.all}</option>
            {materials.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label>
          {dict.filters.sort}
          <select name="sort" defaultValue={current.sort}>
            <option value="newest">{dict.filters.newest}</option>
            <option value="price_asc">{dict.filters.priceAsc}</option>
            <option value="price_desc">{dict.filters.priceDesc}</option>
            <option value="name_asc">{dict.filters.nameAsc}</option>
          </select>
        </label>

        <div className="inline-actions">
          <button className="button" type="submit">
            {dict.filters.apply}
          </button>
          <a className="button-secondary" href={`/${lang}/sklep`}>
            {dict.filters.clear}
          </a>
        </div>
      </form>
    </aside>
  );
}