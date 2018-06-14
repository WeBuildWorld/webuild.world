const Promisify = <T>(inner: any): Promise<T> =>
  new Promise((resolve, reject) =>
    inner((err: Error, res: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );

export default Promisify;
