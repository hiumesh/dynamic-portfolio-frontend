import React, { useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

// Import JSON data directly
import countries from "@/data/countries.json";
import states from "@/data/states.json";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { z } from "zod";

interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

interface CountryProps {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  region_id: string;
  subregion: string;
  subregion_id: string;
  nationality: string;
  timezones: Timezone[];
  translations: Record<string, string>;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

interface StateProps {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string | null;
  latitude: string;
  longitude: string;
}

interface Location {
  country: string;
  state: string;
}

interface LocationSelectorProps {
  disabled?: boolean;
  value?: Location;
  onChange?: (loc: Location) => void;
}

const LocationSelector = ({
  disabled,
  value,
  onChange,
}: LocationSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(
    null
  );

  const stateFieldRef = useRef<HTMLElement | null>(null);

  // Cast imported JSON data to their respective types
  const countriesData = countries as CountryProps[];
  const statesData = states as StateProps[];

  // Filter states for selected country
  const availableStates = useMemo(
    () => statesData.filter((state) => state.country_id == selectedCountry?.id),
    [selectedCountry, statesData]
  );

  let countriesList = useAsyncList<(typeof countriesData)[0]>({
    async load({ signal, filterText }) {
      let items;
      if (filterText)
        items = countriesData.filter((item) =>
          item.name.toLowerCase().startsWith(filterText.toLowerCase())
        );
      else items = countriesData.slice(0, 10);

      return {
        items: items,
      };
    },
  });

  let statesList = useAsyncList<(typeof availableStates)[0]>({
    async load({ signal, filterText }) {
      let items;
      if (filterText)
        items = availableStates.filter((item) =>
          item.name.toLowerCase().startsWith(filterText.toLowerCase())
        );
      else items = availableStates.slice(0, 10);

      return {
        items: items,
      };
    },
  });

  const handleCountrySelect = (country: CountryProps | null) => {
    console.log(country);
    setSelectedCountry(country);
    onChange?.({
      country: country?.name ?? "",
      state: "",
    });
    console.log(stateFieldRef.current);
    if (stateFieldRef.current) {
      (stateFieldRef.current as HTMLInputElement).value = "";
      stateFieldRef.current?.removeAttribute("value");
    }
  };

  const handleStateSelect = (state: StateProps | null) => {
    onChange?.({
      country: selectedCountry?.name ?? "",
      state: state?.name ?? "",
    });
  };

  const stateFieldCallbackRef = (node: HTMLElement | null) => {
    stateFieldRef.current = node;
  };

  return (
    <div className="flex gap-4">
      <Autocomplete
        placeholder="Country..."
        aria-label="Country "
        inputValue={countriesList.filterText}
        isLoading={countriesList.isLoading}
        items={countriesList.items}
        onSelectionChange={(key) => {
          handleCountrySelect(
            countriesData.find((country) => country.id == key) ?? null
          );
        }}
        onInputChange={countriesList.setFilterText}
      >
        {(country) => (
          <AutocompleteItem key={country.id} textValue={country.name}>
            <div className="flex items-center gap-2">
              <span>{country.emoji}</span>
              <span>{country.name}</span>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
      {availableStates.length > 0 && (
        <Autocomplete
          placeholder="State..."
          aria-label="State"
          inputValue={statesList.filterText}
          isLoading={statesList.isLoading}
          items={statesList.items}
          ref={stateFieldCallbackRef}
          onSelectionChange={(key) => {
            handleStateSelect(
              availableStates.find((state) => state.id == key) ?? null
            );
          }}
          onInputChange={statesList.setFilterText}
        >
          {(state) => (
            <AutocompleteItem key={state.id} textValue={state.name}>
              {state.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    </div>
  );
};

export default LocationSelector;
