<template>
  <neu-container class="filter-component mw-100">
    <div class="d-flex">
      <neu-button color="primary" fill="raised" @click="toggleFilterModal()">
        <span class="material-symbols-outlined"> filter_list </span>
        <span class="capitalize">Filters</span>
      </neu-button>
      <neu-button
        aria-label="RemoveAll"
        color="primary"
        fill="flat"
        @click="removeAllFilter()"
        >Clear all</neu-button
      >
    </div>
    <div v-if="currentModal" class="filter-modal">
      <neu-card-content class="pr-2 pl-2 d-flex">
        <fieldset>
          <legend>&nbsp;</legend>
          Filter&nbsp;By
        </fieldset>
        <fieldset class="border-1">
          <legend>Column</legend>
          <neu-item>
            <neu-select
              :value="filterColumn"
              @v-neu-change="updateField($event, 'filterColumn')"
            >
              <neu-option
                :key="column.name"
                v-for="column in columns"
                :value="column.name"
                >{{ column.label }}</neu-option
              >
            </neu-select>
          </neu-item>
        </fieldset>
        <fieldset class="border-1">
          <legend>Operator</legend>
          <neu-item>
            <neu-select
              :value="filterMatch"
              @v-neu-change="updateField($event, 'filterMatch')"
            >
              <neu-option
                :key="match.name"
                v-for="match in matches"
                :value="match.name"
                >{{ match.label }}</neu-option
              >
            </neu-select>
          </neu-item>
        </fieldset>
        <fieldset class="border-1">
          <legend>Value</legend>
          <neu-item>
            <neu-input
              :value="filterValue"
              @v-neu-change="updateField($event, 'filterValue')"
              type="text"
              autocomplete="off"
              inputmode="search"
              enterkeyhint="filter value"
              autocorrect="off"
            >
            </neu-input>
          </neu-item>
        </fieldset>
        <neu-card-actions class="pr-0 pb-0 pl-0" right>
          <neu-button
            :disabled="!selectedFilters.length"
            aria-label="Remove"
            color="primary"
            fill="flat"
            @click="removeFilter()"
            >Remove</neu-button
          >
          <neu-button
            aria-label="Add Filter"
            color="primary"
            fill="flat"
            @click="addFilter()"
            >Add Filter</neu-button
          >
          <neu-button color="primary" @click="applyFilter()" fill="raised"
            >Apply</neu-button
          >
        </neu-card-actions>
      </neu-card-content>
      <neu-card-content v-if="formError.msg">
        <neu-label color="danger">{{ formError.msg }}</neu-label>
      </neu-card-content>
      <neu-card-content class="pr-2 pl-2 d-flex" v-if="filters.length">
        Filter Added:
        <neu-badge
          class="added-filter-badge"
          :key="filter.filterName"
          v-for="filter in filters"
          :color="isFilterSelected(filter) ? 'primary' : 'orange-20'"
          :content="getBadgeContent(filter)"
          @click="toggleSelection(filter)"
        ></neu-badge>
      </neu-card-content>
    </div>
  </neu-container>
</template>
  
<script lang="ts">
import { NeuContainer } from '@neutron/vue'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'filter-component',
  props: {
    columns: {
      type: Array,
      required: true,
      default: () => [],
    } as any,
    matches: {
      type: Array,
      required: true,
      default: () => [],
    } as any,
  },
  components: { NeuContainer },
  data: () => {
    return {
      currentModal: false,
      filters: [] as any,
      filterColumn: '',
      filterMatch: '',
      filterValue: '',
      selectedFilters: [] as any,
      formError: {
          type: '',
          msg: '',
        } as any,
    }
  },
  mounted() {
    this.setDefaultFilter();
  },
  watch: {
    columns(value: any) {
      this.filterColumn = value[0]?.name || '';
    },
  },
  methods: {
    /**
     * Setting default values for filter input values
     */
    setDefaultFilter() {
      this.filterColumn = this.columns[0]?.name || '';
      this.filterMatch = this.matches[0]?.name || "equal";
      this.filterValue = '';
    },
    /**
     * filter toggle modal on and off
     */
    toggleFilterModal() {
      this.currentModal = !this.currentModal;
    },
    /**
     * Finding index if value not matching in the filters array. 
     * @param filter 
     * @returns {Boolean} true/false
     */
    isValidFilter(filter: any) {
      const index = this.filters.findIndex(
        (e: any) =>
          e.filterColumn === filter.filterColumn &&
          e.filterMatch === filter.filterMatch
      )
      return index === -1;
    },
    /**
     * Adding filters to filters array
     */
    addFilter() {
      const filterColumn = this.filterColumn;
      const filterMatch = this.filterMatch;
      const filterValue = this.filterValue;
      const filter = { filterColumn, filterMatch, filterValue };
      if (this.isValidFilter(filter)) {
        this.filters.push(filter);
        this.setDefaultFilter();
      } else {
        this.formError = {
          type: 'warning',
          msg: 'Invalid filter',
        }
      }
    },
    /**
     * removing filters from filters array
     */
    removeFilter() {
      this.selectedFilters.forEach((selectedFilter: any) => {
        const index = this.filters.findIndex(
          (e: any) =>
            e?.filterColumn === selectedFilter?.filterColumn &&
            e?.filterMatch === selectedFilter?.filterMatch
        )
        this.filters?.splice(index, 1);
      })
      this.selectedFilters = [];
    },
    /**
     * Clear all filters
     */
    removeAllFilter() {
      this.filters = [];
      this.selectedFilters = [];
      this.applyFilter();
    },
    /**
     * Applying filters and emits the filters array to parent component which is 'filter-data' event
     */
    applyFilter() {
      if (this.filterValue) this.addFilter();
      this.$emit('filter-data', this.filters);
      this.currentModal = false;
      this.formError = {
          type: '',
          msg: '',
        }
    },
    /**
     * updating the form fields value
     * @param ev CustomEvent
     * @param field value
     */
    updateField(ev: CustomEvent, field: any) {
      var vm = this as any;
      vm[field]  = ev.detail.value;
    },
    /**
     * returns the filter root format
     * @param filter 
     */
    getBadgeContent(filter: any) {
      return `${filter?.filterColumn}:${filter?.filterMatch}:${filter?.filterValue}`;
    },
   /**
    * Toggle selection of badge for remove/add to the selectedFilters array
    * @param filter 
    */
    toggleSelection(filter: any) {
      const index = this.selectedFilters?.findIndex(
        (e: any) =>
          e?.filterColumn === filter?.filterColumn &&
          e?.filterMatch === filter?.filterMatch
      );
      if (index > -1) {
        this.selectedFilters?.splice(index, 1);
      } else {
        this.selectedFilters?.push(filter);
      };
    },
    /**
     * Finding the index from selected array for display styles variants.
     * @param filter 
     */
    isFilterSelected(filter: any) {
      const index = this.selectedFilters?.findIndex(
        (e: any) =>
          e?.filterColumn === filter?.filterColumn &&
          e?.filterMatch === filter?.filterMatch
      )
      return index > -1;
    },
  },
})
</script>
  
  <style scoped lang="scss">
.filter-component {
  border: 0.0625rem solid var(--neu-color-gray-40);
  padding: 0.625rem;
  .capitalize {
    text-transform: uppercase;
  }
}
.filter-modal {
  position: absolute;
  bottom: 55px;
  z-index: 999;
  background: var(--neu-color-gray-10);
  width: calc(100% - 1.25rem);
}
.added-filter-badge {
  padding: 8px;
  cursor: pointer;
  margin: 0px 6px;
}
.border-1 {
  border: 1px solid;
  border-radius: 5px;
  legend {
    padding: 0px 5px;
  }
}
</style>
  