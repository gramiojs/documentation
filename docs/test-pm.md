---
title: Test Package Managers
---

# Test Package Managers Plugin

## Markdown syntax

::: pm-add gramio
:::

::: pm-add -D @gramio/types
:::

::: pm-run dev
:::

::: pm-install
:::

## Vue component

<PackageManagers pkg="gramio" />

<PackageManagers pkg="@gramio/types" dev />

<PackageManagers type="run" pkg="dev" />

<PackageManagers type="create" pkg="gramio" />

## JSR

<PackageManagers jsr="@gramio/bot" />

## Custom set

<PackageManagers pkg="gramio" :pkg-managers='["npm", "bun", "deno"]' />
