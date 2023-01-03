import {
    ApplicationInsights
  } from '@microsoft/applicationinsights-web'

  const appInsights = new ApplicationInsights({
    config: {
      connectionString: `InstrumentationKey=${process.env.VUE_APP_INSTRUMENTATION_KEY};IngestionEndpoint=${process.env.VUE_APP_INGESTION_ENDPOINT}`,
      autoTrackPageVisitTime: true,
      enableAutoRouteTracking: true,
      enableRequestHeaderTracking: true,
      enableResponseHeaderTracking: true
    }
  })
  
  appInsights.loadAppInsights();
    
  export function useAppInsights() {
    return appInsights
  }