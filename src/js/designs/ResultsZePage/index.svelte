<script>
  import ResultsList from '../ResultsList';
  import ResultsPagination from '../../components/ResultsPagination';
  import ResultsToolbar from '../../components/ResultsToolbar';
</script>

<div class="container-fluid">
  <div class="row">
    <div class="col-md-3 col-lg-2 bg-light" />
    <div class="col position-relative">
      <ResultsToolbar />
      <ResultsList />
      <ResultsPagination />
    </div>
  </div>
</div>

<style lang="scss">
</style>
