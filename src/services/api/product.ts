import { AxiosResponse } from 'axios'
import { BASE_API_URL } from '../../environment/environment'
import { ProductType } from '../../shared/types'
import api from './axios-unterceptor'

const baseApi = BASE_API_URL

export const getAllProductApi = async ():Promise<ProductType[]> => {
    const response:AxiosResponse<ProductType[]> = await api.get<ProductType[]>(`${baseApi}/products`)
    return response.data;
}

export const getProductApi = async (id:number | string | undefined):Promise<ProductType> => {
    const response:AxiosResponse<ProductType> = await api.get<ProductType>(`${baseApi}/products/${id}`)
    return response.data;
}

export const postProductApi = async (product:ProductType):Promise<ProductType> => {
    const response:AxiosResponse<ProductType> = await api.post<ProductType>(`${baseApi}/products`,product)
    return response.data;
}


export const patchProductApi = async (product:ProductType):Promise<ProductType> => {
    const response:AxiosResponse<ProductType> = await api.patch<ProductType>(`${baseApi}/products/${product.id}`,product)
    return response.data;
}

export const deleteProductApi = async (id:number|string|null|undefined) => {
    const response:AxiosResponse = await api.delete(`${baseApi}/products/${id}`)
    return response.data;
}

export const getUserProductsApi = async (
  userId: number | string
): Promise<ProductType[]> => {
  const response: AxiosResponse<ProductType[]> = await api.get<ProductType[]>(
    `${baseApi}/products`
  );

  const data = response.data ?? [];
  const uidNum = Number(userId);
  const hasNumericId = !Number.isNaN(uidNum);

  const filtered = data.filter((p: ProductType) => {
    const nestedId = p?.user?.id;

    if (hasNumericId) {
      return nestedId === uidNum;
    }
    return String(nestedId) === String(userId);
  });

  return filtered;
};

