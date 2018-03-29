import { apiService } from '@app/core/services/api.service';

const source = apiService.get('http://localhost:8080/api/items');
source.subscribe(
  (response: any) => console.log(response),
  (error: any) => console.error(error),
  () => console.log('done')
);
