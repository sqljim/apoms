import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/app/core/services/http/api.service';
import { Observable } from 'rxjs';
import { SuccessOnlyResponse } from 'src/app/core/models/responses';
import { VehicleList } from 'src/app/core/models/driver-view';

@Injectable({
  providedIn: 'root'
})

export class DriverViewService extends APIService {

  endpoint = 'DriverView';

  constructor(public http: HttpClient) {
    super(http);
  }

  public async upsertVehicleListItem(vehicleDetail: any) : Promise<SuccessOnlyResponse> {
    if (vehicleDetail.vehicleId) {
      return await this.put(vehicleDetail);
    } else {
      return await this.post(vehicleDetail);
    }
  }

  public getVehicleListTableData(): Promise<any> {
    const request = '?GetVehicleListTableData';
    return this.get(request);
  }

  public async deleteVehicleListItem(vehicleId : number) : Promise<SuccessOnlyResponse> {
    let deleteobject = {
      vehicleId:vehicleId,
      isDeleted: true
    }
    return await this.put(deleteobject).then((output)=>{
      return output;
    }).catch((error:any)=>{
        console.log(error);
    });
    
  }

}