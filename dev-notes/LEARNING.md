# Table keep does not have records

Error:

```
/root/typescript_projects/pattern-research-jul-24/backend/build-dev/src/fills/fills.service.js:34
            throw new Error(errMsg);
                  ^

Error: `fillsRepository` is empty; it has [{
  "count": 4883
}] rows
```

The table exists and has records but `typeorm` doesn't seem to know it.

Solution:

Add `name` property to the `Entity` decorator.

```
@Entity({
  name: appConstants.databaseRelated.tables.fills,
  synchronize: true,
})
export class FillEntity { ... }
```

# Create-react-app with $PWD at `frontend` instead of `$ROOT_DIR`

Error:

```
root@vmi1175516:~/typescript_projects/pattern-research-jul-24# npx create-react-app frontend
Need to install the following packages:
create-react-app@5.0.1
Ok to proceed? (y) y
npm WARN deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm WARN deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm WARN deprecated uid-number@0.0.6: This package is no longer supported.
npm WARN deprecated fstream-ignore@1.0.5: This package is no longer supported.
npm WARN deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
npm WARN deprecated fstream@1.0.12: This package is no longer supported.
npm WARN deprecated tar@2.2.2: This version of tar is no longer supported, and will not receive security updates. Please upgrade asap.

Creating a new React app in /root/typescript_projects/pattern-research-jul-24/frontend.

Installing packages. This might take a couple of minutes.
Installing react, react-dom, and react-scripts with cra-template...


added 1 package in 3s

128 packages are looking for funding
  run `npm fund` for details
Missing dependencies in package.json
```

Solution:

```
cd frontend
npx create-react-app .
```